import { Test, TestingModule } from '@nestjs/testing';
import { LibMetaService } from './lib-meta.service';

describe('LibMetaService', () => {
  let service: LibMetaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LibMetaService],
    }).compile();

    service = module.get<LibMetaService>(LibMetaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
