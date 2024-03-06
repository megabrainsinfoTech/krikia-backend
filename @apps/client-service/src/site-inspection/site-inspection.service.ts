import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { SiteInspection } from './site-inspection.model';
import { CreateSiteInspectionDTO, UpdateSiteInspectionDTO } from './site-inspection.dto';

@Injectable()
export class SiteInspectionService {

    constructor(@InjectModel(SiteInspection) private readonly siteInspection: typeof SiteInspection){}

    async create(createBody: CreateSiteInspectionDTO){
        await this.siteInspection.create(createBody as any);
    }

    async findById(id: string){
        return await this.siteInspection.findByPk(id);
    }

    async findAll(id: string){
        return await this.siteInspection.findAll();
    }

    async findAllByUserId(userId: string){
        return await this.siteInspection.findAll({ where: { UserId: userId } });
    }

    async findAllByBusinessId(bizId: string){
        return await this.siteInspection.findAll({ where: { BusinessId: bizId } });
    }

    async update(id: string, updateBody: UpdateSiteInspectionDTO){
        await this.siteInspection.update(updateBody, { where: { id } });
    }

    async delete(id: string){
        await this.siteInspection.destroy({ where: { id } });
    }

}
