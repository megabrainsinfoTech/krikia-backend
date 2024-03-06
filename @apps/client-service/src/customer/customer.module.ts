import { Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Customer } from './customer.model';

@Module({
  imports: [SequelizeModule.forFeature([Customer])],
  providers: [CustomerService],
  exports: [CustomerService]
})
export class CustomerModule {}
