import { Module } from '@nestjs/common';
import { OptimizeImagesService } from './optimize-images.service';
import { OptimizeImagesController } from './optimize-images.controller';

@Module({
  controllers: [OptimizeImagesController],
  providers: [OptimizeImagesService],
})
export class OptimizeImagesModule {}
