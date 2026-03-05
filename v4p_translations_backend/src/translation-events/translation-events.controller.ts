import { Controller, Post, Query } from '@nestjs/common';
import { TranslationEventsService } from './translation-events.service';
import { envs } from 'src/config/envs';

@Controller('translation-events')
export class TranslationEventsController {
  constructor(private readonly translationEventsService: TranslationEventsService) { }


  @Post('process')
  processPending(@Query('limit') limit?: string) {
    if (envs.ENVIRONMENT === 'production') {
      return {
        message: 'This action is not allowed in production',
        processedEvents: 0,
        translatedRows: 0,
        errors: 0,
      };
    }
    const parsedLimit = limit ? Number(limit) : NaN;
    const safeLimit =
      Number.isFinite(parsedLimit) && parsedLimit > 0
        ? Math.floor(parsedLimit)
        : undefined;
    return this.translationEventsService.processPendingEvents(safeLimit);
  }


}
