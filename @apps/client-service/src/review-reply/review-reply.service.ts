import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateReviewReplyDTO, UpdateReviewReplyDTO } from './review-reply.dto';
import { ReviewReply } from './review-reply.model';

@Injectable()
export class ReviewReplyService {

    constructor(@InjectModel(ReviewReply) private readonly reviewReply: typeof ReviewReply){}

    async create(createBody: CreateReviewReplyDTO){
        await this.reviewReply.create(createBody as any);
    }

    async findById(id: string){
        return await this.reviewReply.findByPk(id);
    }

    async update(id: string, updateBody: UpdateReviewReplyDTO){
        await this.reviewReply.update(updateBody, { where: { id } });
    }

    async delete(id: string){
        await this.reviewReply.destroy({ where: { id } });
    }

}
