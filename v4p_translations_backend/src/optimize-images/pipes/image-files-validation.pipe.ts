import {
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { MAX_IMAGE_FILE_BYTES } from '../optimize-images.constants';

const IMAGE_MIME = /^image\//i;

@Injectable()
export class ImageFilesValidationPipe
  implements PipeTransform<Express.Multer.File[], Express.Multer.File[]>
{
  transform(files: Express.Multer.File[]): Express.Multer.File[] {
    if (!files?.length) {
      throw new BadRequestException(
        'Debes enviar al menos un archivo en el campo "files".',
      );
    }

    for (const file of files) {
      const size = file.size ?? file.buffer?.length ?? 0;
      if (size > MAX_IMAGE_FILE_BYTES) {
        throw new BadRequestException(
          `"${file.originalname}" supera el máximo de 5MB (${size} bytes).`,
        );
      }
      if (!file.mimetype || !IMAGE_MIME.test(file.mimetype)) {
        throw new BadRequestException(
          `"${file.originalname}" no es una imagen válida (tipo: ${file.mimetype ?? 'desconocido'}).`,
        );
      }
    }

    return files;
  }
}
