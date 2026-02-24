import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ManagerService } from "./manager.service";
import { ManagerController } from "./manager.controller";
import { TranslationTable } from "src/translation-tables/entities/translation-table.entity";
import { ClienteTranslation } from "src/translations/entities/clientTranslations.entity";

@Module({
  imports: [TypeOrmModule.forFeature([TranslationTable, ClienteTranslation])],
  controllers: [ManagerController],
  providers: [ManagerService],
})
export class ManagerModule {}
