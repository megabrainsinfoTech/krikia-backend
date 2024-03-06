import { Test, TestingModule } from '@nestjs/testing';
import { ReviewReplyService } from './review-reply.service';

describe('ReviewReplyService', () => {
  let service: ReviewReplyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReviewReplyService],
    }).compile();

    service = module.get<ReviewReplyService>(ReviewReplyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
