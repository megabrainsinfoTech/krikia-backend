import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateReviewDTO, UpdateReviewDTO } from './review.dto';
import { Review } from './review.model';

@Injectable()
export class ReviewService {

    constructor(@InjectModel(Review) private readonly review: typeof Review){}

    async create(createBody: CreateReviewDTO){
        await this.review.create(createBody as any);
    }

    async findById(id: string){
        return await this.review.findByPk(id);
    }

    async findAll(id: string){
        return await this.review.findAll();
    }

    async findAllByUserId(userId: string){
        return await this.review.findAll({ where: { UserId: userId } });
    }

    async update(id: string, updateBody: UpdateReviewDTO){
        await this.review.update(updateBody, { where: { id } });
    }

    async delete(id: string){
        await this.review.destroy({ where: { id } });
    }

}
