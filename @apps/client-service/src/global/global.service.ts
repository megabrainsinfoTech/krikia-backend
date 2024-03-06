import { Injectable } from '@nestjs/common';
import { BusinessService } from '../business/business.service';

@Injectable()
export class GlobalService {
    constructor(private readonly businessService: BusinessService){}

    async findBusinessById(businessId: string){
       return await this.businessService.findByBusinessId(businessId);
    }
}
