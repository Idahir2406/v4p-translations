import { Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { TranslationEventsService } from './translation-events.service';
import { GetTranslationEventsDto } from './dto/get-translation-events.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('translation-events')
@UseGuards(JwtAuthGuard)
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

  @Get()
  getEvents(@Query() dto: GetTranslationEventsDto) {
    return this.translationEventsService.getEvents(dto);
  }


}
