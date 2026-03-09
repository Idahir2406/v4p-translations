import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";

import { ManagerService } from "./manager.service";
import { GetTranslationsDto } from "./dto/get-translations.dto";
import { UpdateTranslationDto } from "./dto/update-translation.dto";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";

@Controller("manager")
@UseGuards(JwtAuthGuard)
export class ManagerController {
  constructor(private readonly managerService: ManagerService) {}

  @Get(":id/filter-options")
  getFilterOptions(@Param("id", ParseUUIDPipe) id: string) {
    return this.managerService.getFilterOptions(id);
  }

  @Post("get-translations")
  getTranslations(@Body() dto: GetTranslationsDto) {
    return this.managerService.getTranslations(dto);
  }

  @Patch("translation/:id")
  updateTranslation(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateTranslationDto,
  ) {
    return this.managerService.updateTranslation(id, dto);
  }

  @Delete("translation/:id")
  deleteTranslation(@Param("id", ParseIntPipe) id: number) {
    return this.managerService.deleteTranslation(id);
  }
}
