import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTranslationEventDto {
  @IsString()
  @IsNotEmpty()
  table_name: string;

  @IsString()
  @IsNotEmpty()
  field: string;

  @IsString()
  @IsNotEmpty()
  new_value: string;

  @IsString()
  @IsNotEmpty()
  identifier: string;

  @IsString()
  @IsOptional()
  page?: string;
}
