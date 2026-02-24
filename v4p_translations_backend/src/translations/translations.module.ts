import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TranslationsService } from './translations.service';
import { TranslationsController } from './translations.controller';
import { ClienteTranslation } from './entities/clientTranslations.entity';
import { MysqlService } from 'src/common/services/mysql/mysql.service';
import { TranslationTable } from 'src/translation-tables/entities/translation-table.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ClienteTranslation, TranslationTable])],
  controllers: [TranslationsController],
  providers: [TranslationsService, MysqlService],
})
export class TranslationsModule {}
