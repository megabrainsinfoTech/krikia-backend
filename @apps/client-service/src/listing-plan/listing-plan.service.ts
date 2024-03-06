import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateListingPlanDTO, UpdateListingPlanDTO } from './listing-plan.dto';
import { ListingPlan } from './listing-plan.model';
import { ListingPlanOption } from '../listing-plan-option/listing-plan-option.model';
import { House } from '../listing-meta/house.model';
import { ListingPlanDimension } from './listing-plan-dim.model';

@Injectable()
export class ListingPlanService {

    constructor(@InjectModel(ListingPlan) private readonly listingPlan: typeof ListingPlan){}

    async create(createBody: CreateListingPlanDTO){
        try {
            await this.listingPlan.bulkCreate(createBody as any, {
                include: [ {
                    model: ListingPlanOption,
                    as: "options"
                }, {
                    model: House,
                    as: "house"
                }, {
                    model: ListingPlanDimension,
                    as: "dimension"
                } ]
            });
        } catch(err){
            console.log(err)
        }
    }

    async findById(id: string){
        return await this.listingPlan.findByPk(id);
    }

    async update(id: string, updateBody: UpdateListingPlanDTO){
        await this.listingPlan.update(updateBody, { where: { id } });
    }

    async delete(id: string){
        await this.listingPlan.destroy({ where: { id } });
    }

}
