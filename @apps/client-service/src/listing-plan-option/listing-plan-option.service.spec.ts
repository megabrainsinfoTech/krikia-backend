import { Test, TestingModule } from '@nestjs/testing';
import { ListingPlanOptionService } from './listing-plan-option.service';

describe('ListingPlanOptionService', () => {
  let service: ListingPlanOptionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ListingPlanOptionService],
    }).compile();

    service = module.get<ListingPlanOptionService>(ListingPlanOptionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
