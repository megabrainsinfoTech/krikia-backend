import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateListingPlanOptionDTO, UpdateListingPlanOptionDTO } from './listing-plan-option.dto';
import { ListingPlanOption } from './listing-plan-option.model';

@Injectable()
export class ListingPlanOptionService {

    constructor(@InjectModel(ListingPlanOption) private readonly listingPlanOption: typeof ListingPlanOption){}

    async create(createBody: CreateListingPlanOptionDTO){
        await this.listingPlanOption.create(createBody as any);
    }

    async findById(id: string){
        return await this.listingPlanOption.findByPk(id);
    }

    async update(id: string, updateBody: UpdateListingPlanOptionDTO){
        await this.listingPlanOption.update(updateBody, { where: { id } });
    }

    async delete(id: string){
        await this.listingPlanOption.destroy({ where: { id } });
    }

}
