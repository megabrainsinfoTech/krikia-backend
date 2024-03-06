import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Review } from './review.model';

@Module({
  imports: [SequelizeModule.forFeature([Review])],
  providers: [ReviewService],
  exports: [ReviewService]
})
export class ReviewModule {}
