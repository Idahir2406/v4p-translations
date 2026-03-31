import { IsString, IsArray, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateTranslationTableDto {
  @IsString()
  @IsNotEmpty()
  table_name: string;

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  columns: string[];

  @IsString()
  @IsOptional()
  identifier?: string;

  @IsString()
  @IsOptional()
  field_name?: string;
}
