import { Module } from '@nestjs/common';
import { ListingPlanOptionService } from './listing-plan-option.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { ListingPlanOption } from './listing-plan-option.model';

@Module({
  imports: [SequelizeModule.forFeature([ListingPlanOption])],
  providers: [ListingPlanOptionService],
  exports: [ListingPlanOptionService]
})
export class ListingPlanOptionModule {}
