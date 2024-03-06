import { Test, TestingModule } from '@nestjs/testing';
import { SharedWishlistService } from './shared-wishlist.service';

describe('SharedWishlistService', () => {
  let service: SharedWishlistService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SharedWishlistService],
    }).compile();

    service = module.get<SharedWishlistService>(SharedWishlistService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
