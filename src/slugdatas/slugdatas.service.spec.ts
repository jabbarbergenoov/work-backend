import { Test, TestingModule } from '@nestjs/testing';
import { SlugdatasService } from './slugdatas.service';

describe('SlugdatasService', () => {
  let service: SlugdatasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SlugdatasService],
    }).compile();

    service = module.get<SlugdatasService>(SlugdatasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
