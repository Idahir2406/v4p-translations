import { IsString, IsNotEmpty } from 'class-validator';

export class CreateLanguageDto {
  @IsString()
  @IsNotEmpty() 
  code: string;

  @IsString()
  @IsNotEmpty()
  name: string;


}
