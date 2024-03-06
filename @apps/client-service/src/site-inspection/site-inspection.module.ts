import { Module } from '@nestjs/common';
import { SiteInspectionService } from './site-inspection.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { SiteInspection } from './site-inspection.model';

@Module({
  imports: [SequelizeModule.forFeature([SiteInspection])],
  providers: [SiteInspectionService],
  exports: [SiteInspectionService]
})
export class SiteInspectionModule {}
