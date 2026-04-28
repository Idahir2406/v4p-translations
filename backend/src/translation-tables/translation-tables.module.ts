import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { TranslationTablesService } from "./translation-tables.service";
import { TranslationTablesController } from "./translation-tables.controller";
import { TranslationTable } from "./entities/translation-table.entity";

@Module({
  imports: [TypeOrmModule.forFeature([TranslationTable])],
  controllers: [TranslationTablesController],
  providers: [TranslationTablesService],
  exports: [TranslationTablesService],
})
export class TranslationTablesModule {}
