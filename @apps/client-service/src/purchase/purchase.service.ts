import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreatePurchaseDTO, UpdatePurchaseDTO } from './purchase.dto';
import { Purchase } from './purchase.model';
import { loadSQL } from '../+utils/loadSQL';
import { QueryTypes } from 'sequelize';

@Injectable()
export class PurchaseService {

    constructor(@InjectModel(Purchase) private readonly purchase: typeof Purchase){}

    async create(createBody: CreatePurchaseDTO){
        return await this.purchase.create(createBody as any);
    }

    async findById(id: string){
        return await this.purchase.findByPk(id);
    }

    async findAll(){
        return await this.purchase.findAll();
    }

    async findOneByUserId(userId: string, purchaseId: string){
        return await this.purchase.findOne({ where: { id: purchaseId, UserId: userId } });
    }

    async findAllByUserId(userId: string){
        const res = await this.purchase.sequelize?.query(loadSQL("user-purchases"), { type: QueryTypes.SELECT, replacements: { userId } });
        return res;
    }

    async update(id: string, updateBody: UpdatePurchaseDTO){
        await this.purchase.update(updateBody, { where: { id } });
    }

    async delete(id: string){
        await this.purchase.destroy({ where: { id } });
    }

}
