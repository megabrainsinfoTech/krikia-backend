import { Test, TestingModule } from '@nestjs/testing';
import { CustomerService } from './customer.service';
import { CustomerServiceMock } from './customer.service.mock';

describe('CustomerService', () => {
  let service: CustomerServiceMock;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [{
        provide: CustomerService,
        useValue: CustomerServiceMock
      }],
    }).compile();

    service = module.get<CustomerServiceMock>(CustomerServiceMock);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
