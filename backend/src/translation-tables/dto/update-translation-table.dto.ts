import { PartialType } from "@nestjs/mapped-types";
import { CreateTranslationTableDto } from "./create-translation-table.dto";

export class UpdateTranslationTableDto extends PartialType(
  CreateTranslationTableDto,
) {}
