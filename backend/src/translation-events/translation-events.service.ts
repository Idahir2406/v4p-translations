import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import OpenAI from 'openai';
import { Repository } from 'typeorm';
import { TranslationEvent } from './entities/translation-event.entity';
import { ClienteTranslation } from 'src/translations/entities/clientTranslations.entity';
import { Language } from 'src/languages/entities/language.entity';
import { envs } from 'src/config/envs';
import { GetTranslationEventsDto } from './dto/get-translation-events.dto';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class TranslationEventsService {
  private readonly logger = new Logger(TranslationEventsService.name);
  private readonly deepseekClient: OpenAI;

  constructor(
    @InjectRepository(TranslationEvent)
    private readonly translationEventRepository: Repository<TranslationEvent>,
    @InjectRepository(ClienteTranslation)
    private readonly clienteTranslationRepository: Repository<ClienteTranslation>,
    @InjectRepository(Language)
    private readonly languageRepository: Repository<Language>,
  ) {
    this.deepseekClient = new OpenAI({
      apiKey: envs.DEEPSEEK_API_KEY,
      baseURL: 'https://api.deepseek.com',
    });
  }

  async getEvents(dto: GetTranslationEventsDto) {
    const { status } = dto;
    const events = await this.translationEventRepository.find({
      where: { status },
      order: { id: 'ASC' },
    });
    return events;
  }

  @Cron(CronExpression.EVERY_HOUR)
  async processPendingEvents(limit = 100) {
    if (envs.ENVIRONMENT === 'development') {
      return;
    }
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

    const response = await this.deepseekClient.chat.completions.create({
      model: 'deepseek-v4-flash',
      messages: [
        {
          role: 'system',
          content: `You are a professional translator. Translate the following text to the language with ISO code "${lang}". Return ONLY the translated text, no explanations, no extra content.`,
        },
        { role: 'user', content: normalizedText },
      ],
      temperature: 0.3,
    });

    return response.choices[0]?.message?.content?.trim() ?? normalizedText;
  }
}
