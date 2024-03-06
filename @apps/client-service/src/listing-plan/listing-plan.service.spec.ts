import { Test, TestingModule } from '@nestjs/testing';
import { ListingPlanService } from './listing-plan.service';

describe('ListingPlanService', () => {
  let service: ListingPlanService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ListingPlanService],
    }).compile();

    service = module.get<ListingPlanService>(ListingPlanService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
