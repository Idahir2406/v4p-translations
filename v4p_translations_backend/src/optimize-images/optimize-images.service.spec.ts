import { Test, TestingModule } from '@nestjs/testing';
import { OptimizeImagesService } from './optimize-images.service';

describe('OptimizeImagesService', () => {
  let service: OptimizeImagesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OptimizeImagesService],
    }).compile();

    service = module.get<OptimizeImagesService>(OptimizeImagesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
