import { PartialType } from '@nestjs/mapped-types';
import { CreateTranslationEventDto } from './create-translation-event.dto';

export class UpdateTranslationEventDto extends PartialType(CreateTranslationEventDto) {}
