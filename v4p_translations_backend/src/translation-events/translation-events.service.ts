import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as deepl from 'deepl-node';
import { Repository } from 'typeorm';
import { TranslationEvent } from './entities/translation-event.entity';
import { ClienteTranslation } from 'src/translations/entities/clientTranslations.entity';
import { Language } from 'src/languages/entities/language.entity';
import { envs } from 'src/config/envs';

@Injectable()
export class TranslationEventsService {
  private readonly logger = new Logger(TranslationEventsService.name);
  private readonly deeplClient: deepl.DeepLClient;

  constructor(
    @InjectRepository(TranslationEvent)
    private readonly translationEventRepository: Repository<TranslationEvent>,
    @InjectRepository(ClienteTranslation)
    private readonly clienteTranslationRepository: Repository<ClienteTranslation>,
    @InjectRepository(Language)
    private readonly languageRepository: Repository<Language>,
  ) {
    this.deeplClient = new deepl.DeepLClient(envs.DEEPL_API_KEY);
  }

  async processPendingEvents(limit = 100) {
    const pendingEvents = await this.translationEventRepository.find({
      where: { status: 'pending' },
      order: { id: 'ASC' },
      take: limit,
    });

    if (pendingEvents.length === 0) {
      return {
        message: 'No hay eventos pendientes para traducir.',
        processedEvents: 0,
        translatedRows: 0,
        errors: 0,
      };
    }

    const languages = await this.languageRepository.find({
      where: { is_active: true, is_default: false },
      order: { code: 'ASC' },
    });
    const languageCodes = languages.map((language) => language.code);

    if (languageCodes.length === 0) {
      return {
        message: 'No hay idiomas activos para procesar eventos.',
        processedEvents: 0,
        translatedRows: 0,
        errors: pendingEvents.length,
      };
    }

    let translatedRows = 0;
    let processedEvents = 0;
    let errors = 0;

    for (const event of pendingEvents) {
      try {
        for (const lang of languageCodes) {
          const translatedText = await this.translateTextForLanguage(event.new_value ?? '', lang);

          await this.clienteTranslationRepository.upsert(
            {
              table_name: event.table_name,
              lang,
              field: event.field,
              value: translatedText,
              identifier: event.identifier,
            },
            {
              conflictPaths: ['table_name', 'lang', 'field', 'identifier'],
              skipUpdateIfNoValuesChanged: true,
            },
          );

          translatedRows += 1;
        }

        event.status = 'processed';
        await this.translationEventRepository.save(event);
        processedEvents += 1;
      } catch (error) {
        event.status = 'error';
        await this.translationEventRepository.save(event);
        errors += 1;
        const message = error instanceof Error ? error.message : 'Error desconocido';
        this.logger.error(`Error procesando evento ${event.id}: ${message}`);
      }
    }

    return {
      message: 'Procesamiento de eventos completado.',
      processedEvents,
      translatedRows,
      errors,
    };
  }

  private async translateTextForLanguage(text: string, lang: string): Promise<string> {
    const normalizedText = String(text ?? '');
    if (!normalizedText.trim()) {
      return normalizedText;
    }

    const deeplLang = this.getDeeplLang(lang);
    const lines = normalizedText.split(/\r?\n/);
    const linesToTranslate = lines.filter((line) => line.trim().length > 0);

    if (linesToTranslate.length === 0) {
      return normalizedText;
    }

    const result = await this.deeplClient.translateText(
      linesToTranslate,
      null,
      deeplLang,
      { preserveFormatting: true },
    );

    const translatedLines = (Array.isArray(result) ? result : [result]).map(
      (item) => item.text,
    );

    let translatedLineIndex = 0;
    const mergedLines = lines.map((line) => {
      if (!line.trim()) {
        return line;
      }

      const translatedLine = translatedLines[translatedLineIndex];
      translatedLineIndex += 1;
      return translatedLine ?? '';
    });

    return mergedLines.join('\n');
  }

  private getDeeplLang(lang: string): deepl.TargetLanguageCode {
    const langMap: Record<string, deepl.TargetLanguageCode> = {
      en: 'en-US',
      fr: 'fr',
      pt: 'pt-BR',
    };

    return langMap[lang] ?? (lang as deepl.TargetLanguageCode);
  }
}
