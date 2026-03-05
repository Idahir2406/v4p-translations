import { Test, TestingModule } from '@nestjs/testing';
import { TranslationEventsService } from './translation-events.service';

describe('TranslationEventsService', () => {
  let service: TranslationEventsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TranslationEventsService],
    }).compile();

    service = module.get<TranslationEventsService>(TranslationEventsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
