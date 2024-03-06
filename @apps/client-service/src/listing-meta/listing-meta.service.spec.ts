import { Test, TestingModule } from '@nestjs/testing';
import { ListingMetaService } from './listing-meta.service';

describe('ListingMetaService', () => {
  let service: ListingMetaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ListingMetaService],
    }).compile();

    service = module.get<ListingMetaService>(ListingMetaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
