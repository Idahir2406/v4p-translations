import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TranslationsService } from './translations.service';
import { TranslationsController } from './translations.controller';
import { ClienteTranslation } from './entities/clientTranslations.entity';
import { MysqlService } from 'src/common/services/mysql/mysql.service';
import { LanguagesModule } from 'src/languages/languages.module';
import { TranslationTable } from 'src/translation-tables/entities/translation-table.entity';
import { Language } from 'src/languages/entities/language.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ClienteTranslation, TranslationTable, Language]), LanguagesModule],
  controllers: [TranslationsController],
  providers: [TranslationsService, MysqlService],
})
export class TranslationsModule {}
