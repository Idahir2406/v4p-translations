import { Controller, Post, Query } from '@nestjs/common';
import { TranslationEventsService } from './translation-events.service';

@Controller('translation-events')
export class TranslationEventsController {
  constructor(private readonly translationEventsService: TranslationEventsService) { }


  @Post('process')
  processPending(@Query('limit') limit?: string) {
    const parsedLimit = limit ? Number(limit) : NaN;
    const safeLimit =
      Number.isFinite(parsedLimit) && parsedLimit > 0
        ? Math.floor(parsedLimit)
        : undefined;
    return this.translationEventsService.processPendingEvents(safeLimit);
  }


}
