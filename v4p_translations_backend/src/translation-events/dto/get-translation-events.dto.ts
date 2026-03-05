import { IsOptional, IsString } from "class-validator";



export class GetTranslationEventsDto {

  @IsOptional()
  @IsString()
  status?: string;


  


}