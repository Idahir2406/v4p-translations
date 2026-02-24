import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Subject } from 'rxjs';
import * as deepl from 'deepl-node';

import { MysqlService } from 'src/common/services/mysql/mysql.service';
import { envs } from 'src/config/envs';
import { ClienteTranslation } from './entities/clientTranslations.entity';
import { TranslationTable } from 'src/translation-tables/entities/translation-table.entity';

type StreamEventType = 'info' | 'warn' | 'progress' | 'error' | 'complete';

export interface StreamPayload {
  type: StreamEventType;
  message: string;
  tableName?: string;
  columnName?: string;
  lang?: string;
  batchIndex?: number;
  totalBatches?: number;
  batchChars?: number;
  charsUsed?: number;
  remainingChars?: number;
  status?: string;
}

export interface SseMessageEvent {
  data: StreamPayload;
}

type SseEmitter = (payload: StreamPayload) => void;

@Injectable()
export class TranslationsService {
  private readonly deeplClient: deepl.DeepLClient;
  private readonly oneSecond = 1000;
  private readonly maxCharsPerBatch = 5000;
  private readonly logger = new Logger(TranslationsService.name);

  constructor(
    private readonly mysqlService: MysqlService,
    @InjectRepository(ClienteTranslation)
    private readonly clienteTranslationRepository: Repository<ClienteTranslation>,
    @InjectRepository(TranslationTable)
    private readonly translationTableRepository: Repository<TranslationTable>,
  ) {
    this.deeplClient = new deepl.DeepLClient(envs.DEEPL_API_KEY);
  }

  async handleTranslations() {
    const usage = await this.getRemainingChars();
    this.logger.log(`Caracteres disponibles: ${usage}`);

    if (usage <= 0) {
      return { message: 'Límite de caracteres alcanzado', charactersRemaining: usage };
    }

    const results: { tableName: string; columnName: string; lang: string; status: string }[] = [];
    let charsUsed = 0;

    const translationTables = await this.translationTableRepository.find({
      order: { table_name: 'ASC' },
    });

    for (const table of translationTables) {
      for (const column of table.columns) {
        const remainingChars = usage - charsUsed;
        if (remainingChars <= 0) {
          this.logger.warn('Límite de caracteres alcanzado, deteniendo traducciones');
          return { message: 'Límite de caracteres alcanzado', results, charsUsed };
        }

        this.logger.log(`[${table.table_name}] Traduciendo columna: ${column}`);
        const result = await this.translateTable(
          table.table_name,
          column,
          'en',
          remainingChars,
          table.identifier ?? "id",
          table.field_name ?? undefined,
        );

        results.push({
          tableName: table.table_name,
          columnName: column,
          lang: 'en',
          status: result.status,
        });
        charsUsed += result.charsUsed;
      }
    }

    return { message: "Traducciones completadas", results, charsUsed };
  }

  async handleTranslationsStream(subject: Subject<SseMessageEvent>): Promise<void> {
    const emit: SseEmitter = (payload) => subject.next({ data: payload });

    try {
      const usage = await this.getRemainingChars();
      emit({
        type: 'info',
        message: `Caracteres disponibles en DeepL: ${usage}`,
        remainingChars: usage,
      });

      if (usage <= 0) {
        emit({
          type: 'warn',
          message: 'Límite de caracteres alcanzado. No se ejecutaron traducciones.',
          remainingChars: usage,
          status: 'limit_reached',
        });
        emit({
          type: 'complete',
          message: 'Proceso finalizado sin cambios.',
          charsUsed: 0,
          remainingChars: usage,
        });
        return;
      }

      let charsUsed = 0;

      const translationTables = await this.translationTableRepository.find({
        order: { table_name: "ASC" },
      });

      for (const table of translationTables) {
        for (const column of table.columns) {
          const remainingChars = usage - charsUsed;

          if (remainingChars <= 0) {
            emit({
              type: 'warn',
              message: 'Límite de caracteres alcanzado, se detiene el proceso.',
              remainingChars: 0,
              charsUsed,
            });
            emit({
              type: 'complete',
              message: 'Proceso completado por límite de caracteres.',
              charsUsed,
              remainingChars: 0,
            });
            return;
          }

          emit({
            type: 'info',
            message: `Iniciando ${table.table_name}.${column}`,
            tableName: table.table_name,
            columnName: column,
            lang: 'en',
            remainingChars,
          });

          const result = await this.translateTable(
            table.table_name,
            column,
            'en',
            remainingChars,
            table.identifier ?? "id",
            table.field_name ?? undefined,
            emit,
          );

          charsUsed += result.charsUsed;

          emit({
            type: 'progress',
            message: `Finalizó ${table.table_name}.${column} con estado ${result.status}`,
            tableName: table.table_name,
            columnName: column,
            lang: 'en',
            status: result.status,
            charsUsed,
            remainingChars: usage - charsUsed,
          });
        }
      }

      emit({
        type: 'complete',
        message: 'Traducciones completadas correctamente.',
        charsUsed,
        remainingChars: usage - charsUsed,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error desconocido';
      emit({ type: 'error', message: `Error en traducción: ${message}` });
    } finally {
      subject.complete();
    }
  }

  private async translateTable(
    tableName: string,
    columnName: string,
    lang: string,
    charLimit: number,
    identifierCol = 'id',
    fieldNameCol?: string,
    emit?: SseEmitter,
  ) {
    const fullTableName = `${envs.DB_INITIAL}${tableName}`;
    const deeplLang = this.getDeeplLang(lang);
    let charsUsed = 0;

    const remainingRows = await this.getRemainingRows(
      fullTableName,
      columnName,
      lang,
      identifierCol,
      fieldNameCol,
    );

    if (remainingRows.length === 0) {
      const msg = `[${fullTableName}] Traducciones de '${columnName}' a '${lang}' ya completas`;
      this.logOrEmit('info', msg, emit, { tableName, columnName, lang, status: 'already_complete' });
      return { status: 'already_complete', charsUsed: 0 };
    }

    const validRows = remainingRows.filter((row) => {
      const text = String(row[columnName] ?? '').trim();
      return text.length > 0;
    });

    if (validRows.length === 0) {
      const msg = `[${fullTableName}] No hay textos válidos para traducir`;
      this.logOrEmit('warn', msg, emit, { tableName, columnName, lang, status: 'no_valid_texts' });
      return { status: 'no_valid_texts', charsUsed: 0 };
    }

    const batches = this.splitIntoBatchesByChars(validRows, columnName, this.maxCharsPerBatch);
    this.logOrEmit(
      'info',
      `[${fullTableName}] Pendientes: ${validRows.length}, lotes: ${batches.length}`,
      emit,
      { tableName, columnName, lang },
    );

    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      const texts = batch.map((row) => String(row[columnName]).trim());
      const batchChars = texts.reduce((sum, t) => sum + t.length, 0);

      if (charsUsed + batchChars > charLimit) {
        const msg = `[${fullTableName}] Lote requiere ${batchChars} chars, solo quedan ${
          charLimit - charsUsed
        }. Deteniendo.`;
        this.logOrEmit('warn', msg, emit, {
          tableName,
          columnName,
          lang,
          batchIndex: i + 1,
          totalBatches: batches.length,
          batchChars,
          charsUsed,
          remainingChars: charLimit - charsUsed,
        });
        break;
      }

      const results = await this.deeplClient.translateText(texts, null, deeplLang);
      const translatedResults = Array.isArray(results) ? results : [results];
      charsUsed += batchChars;

      const toSave = batch.map((row, index) =>
        this.clienteTranslationRepository.create({
          table_name: fullTableName,
          lang,
          field: fieldNameCol ? String(row[fieldNameCol]) : columnName,
          value: translatedResults[index]?.text ?? '',
          identifier: String(row[identifierCol]),
        }),
      );

      if (toSave.length > 0) {
        await this.clienteTranslationRepository.upsert(toSave, {
          conflictPaths: ['table_name', 'lang', 'field', 'identifier'],
          skipUpdateIfNoValuesChanged: true,
        });
      }

      this.logOrEmit(
        'progress',
        `[${fullTableName}] Lote ${i + 1}/${batches.length} (${batch.length} registros, ${batchChars} chars)`,
        emit,
        {
          tableName,
          columnName,
          lang,
          batchIndex: i + 1,
          totalBatches: batches.length,
          batchChars,
          charsUsed,
          remainingChars: charLimit - charsUsed,
        },
      );

      if (i < batches.length - 1) {
        await this.delay(this.oneSecond * 5);
      }
    }

    return { status: 'done', charsUsed };
  }

  private async getRemainingRows(
    fullTableName: string,
    columnName: string,
    lang: string,
    identifierCol: string,
    fieldNameCol?: string,
  ): Promise<Record<string, any>[]> {
    const whereCondition: Record<string, any> = { table_name: fullTableName, lang };

    if (!fieldNameCol) {
      whereCondition.field = columnName;
    }

    const translatedRecords = await this.clienteTranslationRepository.find({
      select: ['identifier'],
      where: whereCondition,
    });

    const translatedIds = translatedRecords.map((r) => String(r.identifier));
    const translatedIdSet = new Set(translatedIds);

    const selectCols = [identifierCol, columnName];
    if (fieldNameCol && !selectCols.includes(fieldNameCol)) {
      selectCols.push(fieldNameCol);
    }

    const allRows = await this.mysqlService.query<Record<string, any>>(
      `SELECT ${selectCols.join(', ')}
       FROM ${fullTableName}
       WHERE ${columnName} IS NOT NULL
         AND ${columnName} != ''
       ORDER BY ${identifierCol}`,
    );

    if (translatedIds.length === 0) {
      return allRows;
    }

    return allRows.filter((row) => !translatedIdSet.has(String(row[identifierCol])));
  }

  async getTranslationsByTableName(tableName: string, lang: string, fields: string[]) {
    return await this.clienteTranslationRepository.find({
      where: { table_name: tableName, lang, field: In(fields) },
    });
  }

  private async getRemainingChars(): Promise<number> {
    const usage = await this.deeplClient.getUsage();
    if (!usage.character) return 0;

    const remaining = (usage.character.limit ?? 0) - (usage.character.count ?? 0);
    this.logger.log(`DeepL uso: ${usage.character.count}/${usage.character.limit} chars`);
    return remaining;
  }

  private splitIntoBatchesByChars(
    rows: Record<string, any>[],
    columnName: string,
    maxChars: number,
  ): Record<string, any>[][] {
    const batches: Record<string, any>[][] = [];
    let currentBatch: Record<string, any>[] = [];
    let currentChars = 0;

    for (const row of rows) {
      const text = String(row[columnName] ?? '').trim();
      const textLength = text.length;

      if (textLength >= maxChars) {
        if (currentBatch.length > 0) {
          batches.push(currentBatch);
          currentBatch = [];
          currentChars = 0;
        }
        batches.push([row]);
        continue;
      }

      if (currentChars + textLength > maxChars) {
        batches.push(currentBatch);
        currentBatch = [];
        currentChars = 0;
      }

      currentBatch.push(row);
      currentChars += textLength;
    }

    if (currentBatch.length > 0) {
      batches.push(currentBatch);
    }

    return batches;
  }

  private getDeeplLang(lang: string): deepl.TargetLanguageCode {
    const langMap: Record<string, deepl.TargetLanguageCode> = {
      en: 'en-US',
      fr: 'fr',
      pt: 'pt-BR',
    };
    return langMap[lang] ?? (lang as deepl.TargetLanguageCode);
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private logOrEmit(
    type: Exclude<StreamEventType, 'complete' | 'error'>,
    message: string,
    emit?: SseEmitter,
    extra?: Omit<StreamPayload, 'type' | 'message'>,
  ) {
    if (emit) {
      emit({ type, message, ...extra });
      return;
    }

    if (type === 'warn') {
      this.logger.warn(message);
      return;
    }

    this.logger.log(message);
  }
}
