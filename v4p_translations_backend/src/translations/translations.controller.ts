import { Body, Controller, Get, Patch, Query, Sse, UseGuards } from '@nestjs/common';
import { Observable, Subject } from 'rxjs';
import { TranslationsService } from './translations.service';
import { SseMessageEvent } from './translations.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UpdateCronIntervalDto } from './dto/update-cron-interval.dto';

@Controller('translations')
@UseGuards(JwtAuthGuard)
export class TranslationsController {
  constructor(private readonly translationsService: TranslationsService) {}

  @Get('cron/config')
  getCronConfig() {
    return this.translationsService.getCronConfig();
  }

  @Patch('cron/config')
  updateCronConfig(@Body() dto: UpdateCronIntervalDto) {
    return this.translationsService.updateCronInterval(dto.intervalMinutes);
  }

  @Get('run')
  runTranslations( @Query('lang') lang: string ) {
    return this.translationsService.handleTranslations(lang);
  }

  @Sse('stream')
  streamTranslations( @Query('lang') lang: string ): Observable<SseMessageEvent> {
    const subject = new Subject<SseMessageEvent>();
    void this.translationsService.handleTranslationsStream(subject, lang);
    return subject.asObservable();
  }
}
