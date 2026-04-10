import {
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import {
  MAX_FILES_PER_REQUEST,
  MAX_IMAGE_FILE_BYTES,
} from './optimize-images.constants';
import { ImageFilesValidationPipe } from './pipes/image-files-validation.pipe';
import { OptimizeImagesService } from './optimize-images.service';

@Controller('optimize-images')
export class OptimizeImagesController {
  constructor(private readonly optimizeImagesService: OptimizeImagesService) {}

  @Post()
  @UseInterceptors(
    FilesInterceptor('files', MAX_FILES_PER_REQUEST, {
      storage: memoryStorage(),
      limits: { fileSize: MAX_IMAGE_FILE_BYTES },
    }),
  )
  optimizeImages(
    @UploadedFiles(new ImageFilesValidationPipe())
    files: Express.Multer.File[],
  ) {
    console.log(files);
    return this.optimizeImagesService.optimizeImages(files);
  }
}
