import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TranslationEventsService } from './translation-events.service';
import { TranslationEventsController } from './translation-events.controller';
import { TranslationEvent } from './entities/translation-event.entity';
import { ClienteTranslation } from 'src/translations/entities/clientTranslations.entity';
import { Language } from 'src/languages/entities/language.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TranslationEvent, ClienteTranslation, Language])],
  controllers: [TranslationEventsController],
  providers: [TranslationEventsService],
})
export class TranslationEventsModule {}
