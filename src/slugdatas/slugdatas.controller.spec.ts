import { Test, TestingModule } from '@nestjs/testing';
import { SlugdatasController } from './slugdatas.controller';
import { SlugdatasService } from './slugdatas.service';

describe('SlugdatasController', () => {
  let controller: SlugdatasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SlugdatasController],
      providers: [SlugdatasService],
    }).compile();

    controller = module.get<SlugdatasController>(SlugdatasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
