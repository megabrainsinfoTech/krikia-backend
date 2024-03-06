import { Test, TestingModule } from '@nestjs/testing';
import { UserBusinessService } from './user-business.service';
import { UserBusinessServiceMock } from './user-business.service.mock';

describe('UserBusinessService', () => {
  let service: UserBusinessServiceMock;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [{
        provide: UserBusinessService,
        useValue: UserBusinessServiceMock
      }],
    }).compile();

    service = module.get<UserBusinessServiceMock>(UserBusinessServiceMock);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
