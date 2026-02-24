import { Controller, Get, Sse } from '@nestjs/common';
import { Observable, Subject } from 'rxjs';
import { TranslationsService } from './translations.service';
import { SseMessageEvent } from './translations.service';

@Controller('translations')
export class TranslationsController {
  constructor(private readonly translationsService: TranslationsService) {}

  @Get('run')
  runTranslations() {
    return this.translationsService.handleTranslations();
  }

  @Sse('stream')
  streamTranslations(): Observable<SseMessageEvent> {
    const subject = new Subject<SseMessageEvent>();
    void this.translationsService.handleTranslationsStream(subject);
    return subject.asObservable();
  }
}
