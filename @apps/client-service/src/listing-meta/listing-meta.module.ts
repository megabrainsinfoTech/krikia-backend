import { Module } from '@nestjs/common';
import { ListingMetaService } from './listing-meta.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { House } from './house.model';

@Module({
  imports: [SequelizeModule.forFeature([House])],
  providers: [ListingMetaService]
})
export class ListingMetaModule {}
