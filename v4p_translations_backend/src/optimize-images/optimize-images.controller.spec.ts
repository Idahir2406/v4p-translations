import { Test, TestingModule } from '@nestjs/testing';
import { OptimizeImagesController } from './optimize-images.controller';
import { OptimizeImagesService } from './optimize-images.service';

describe('OptimizeImagesController', () => {
  let controller: OptimizeImagesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OptimizeImagesController],
      providers: [OptimizeImagesService],
    }).compile();

    controller = module.get<OptimizeImagesController>(OptimizeImagesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
