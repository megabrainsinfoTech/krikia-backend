import { Test, TestingModule } from '@nestjs/testing';
import { BusinessAuthMiddleware } from './business-auth.middleware';
import { UserBusinessService } from '../../user-business/user-business.service';
import { MockUserBusinessService } from './mock-user-business.service';

describe('BusinessAuthMiddleware', () => {
  let middleware: BusinessAuthMiddleware;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BusinessAuthMiddleware,
        { provide: UserBusinessService, useValue: MockUserBusinessService }, // Inject mock service
      ],
    }).compile();

    middleware = module.get<BusinessAuthMiddleware>(BusinessAuthMiddleware);
  });

  it('should be defined', () => {
    expect(BusinessAuthMiddleware).toBeDefined();
  });

});