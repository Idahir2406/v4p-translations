import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";

import { TranslationTablesService } from "./translation-tables.service";
import { CreateTranslationTableDto } from "./dto/create-translation-table.dto";
import { UpdateTranslationTableDto } from "./dto/update-translation-table.dto";

@Controller("translation-tables")
export class TranslationTablesController {
  constructor(
    private readonly translationTablesService: TranslationTablesService,
  ) {}

  @Post()
  create(@Body() dto: CreateTranslationTableDto) {
    return this.translationTablesService.create(dto);
  }

  @Get()
  findAll() {
    return this.translationTablesService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.translationTablesService.findOne(id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() dto: UpdateTranslationTableDto) {
    return this.translationTablesService.update(id, dto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.translationTablesService.remove(id);
  }
}
