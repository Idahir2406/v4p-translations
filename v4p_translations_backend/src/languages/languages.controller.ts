import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";

import { LanguagesService } from "./languages.service";
import { CreateLanguageDto } from "./dto/create-language.dto";
import { UpdateLanguageDto } from "./dto/update-language.dto";

@Controller("languages")
export class LanguagesController {
  constructor(private readonly languagesService: LanguagesService) {}

  @Post()
  create(@Body() dto: CreateLanguageDto) {
    return this.languagesService.create(dto);
  }

  @Get()
  findAll() {
    return this.languagesService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.languagesService.findOne(id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() dto: UpdateLanguageDto) {
    return this.languagesService.update(id, dto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.languagesService.remove(id);
  }
}
