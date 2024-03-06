import { Module } from '@nestjs/common';
import { PurchaseService } from './purchase.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Purchase } from './purchase.model';

@Module({
  imports: [SequelizeModule.forFeature([Purchase])],
  providers: [PurchaseService],
  exports: [PurchaseService]
})
export class PurchaseModule {}
