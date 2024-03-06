import { Module } from '@nestjs/common';
import { ListingPlanService } from './listing-plan.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { ListingPlan } from './listing-plan.model';
import { ListingPlanDimension } from './listing-plan-dim.model';

@Module({
  imports: [SequelizeModule.forFeature([ListingPlan, ListingPlanDimension])],
  providers: [ListingPlanService],
  exports: [ListingPlanService]
})
export class ListingPlanModule {}
