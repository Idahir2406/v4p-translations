import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TranslationsModule } from './translations/translations.module';
import { TranslationTablesModule } from './translation-tables/translation-tables.module';
import { LanguagesModule } from './languages/languages.module';
import { ManagerModule } from './manager/manager.module';
import { AuthModule } from './auth/auth.module';
import { CronJobsService } from './common/services/cron-jobs/cron-jobs.service';
import { ScheduleModule } from '@nestjs/schedule';
import { typeOrmConfig } from './database/datasource';
import { TranslationEventsModule } from './translation-events/translation-events.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    TranslationsModule,
    TranslationTablesModule,
    LanguagesModule,
    ManagerModule,
    AuthModule,
    ScheduleModule.forRoot(),
    TranslationEventsModule,
  ],
  controllers: [AppController],
  providers: [AppService, CronJobsService],
})
export class AppModule {}
