import { IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";

export class GetTranslationsDto {
  @IsUUID()
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsOptional()
  lang?: string;

  @IsString()
  @IsOptional()
  field?: string;
}
