import { Test, TestingModule } from '@nestjs/testing';
import { SiteInspectionService } from './site-inspection.service';

describe('SiteInspectionService', () => {
  let service: SiteInspectionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SiteInspectionService],
    }).compile();

    service = module.get<SiteInspectionService>(SiteInspectionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
