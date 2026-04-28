import { Test, TestingModule } from '@nestjs/testing';
import { TranslationEventsController } from './translation-events.controller';
import { TranslationEventsService } from './translation-events.service';

describe('TranslationEventsController', () => {
  let controller: TranslationEventsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TranslationEventsController],
      providers: [TranslationEventsService],
    }).compile();

    controller = module.get<TranslationEventsController>(TranslationEventsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
