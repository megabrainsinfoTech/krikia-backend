import { Module } from '@nestjs/common';
import { ReviewReplyService } from './review-reply.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { ReviewReply } from './review-reply.model';

@Module({
  imports: [SequelizeModule.forFeature([ReviewReply])],
  providers: [ReviewReplyService],
  exports: [ReviewReplyService]
})
export class ReviewReplyModule {}
