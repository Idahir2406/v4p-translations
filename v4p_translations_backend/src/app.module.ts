import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TranslationsModule } from './translations/translations.module';
import { envs } from './config/envs';
import { TranslationTablesModule } from './translation-tables/translation-tables.module';
import { LanguagesModule } from './languages/languages.module';
import { ManagerModule } from './manager/manager.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: envs.DB_HOST,
      username: envs.DB_USERNAME,
      password: envs.DB_PASSWORD,
      database: envs.DB_DATABASE,
      autoLoadEntities: true,
      synchronize: false,
    }),
    TranslationsModule,
    TranslationTablesModule,
    LanguagesModule,
    ManagerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
