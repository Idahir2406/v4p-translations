export class CreateTranslationTableDto {
  table_name: string;
  columns: string[];
  identifier?: string;
  field_name?: string;
}
