import { Body, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UserBusiness } from './user-business.model';
import { CreateUserBusinessDTO } from './user-business.dto';
import { ClsService } from 'nestjs-cls';
import { loadSQL } from '../+utils/loadSQL';
import { QueryTypes } from 'sequelize';
import { Business } from '../business/business.model';
import { Op } from 'sequelize';

@Injectable()
export class UserBusinessService {
    
    constructor(
        @InjectModel(UserBusiness) private readonly userBusiness: typeof UserBusiness,
        private readonly cls: ClsService
    ){}

    async create(@Body() createBody: CreateUserBusinessDTO){
       await this.userBusiness.create(createBody as any);
       return 0;
    }

    async findBusinessByUserId(userId: string, businessId: string){
        return await this.userBusiness.findOne(
            { where: { userId },
              include: [ { model: Business, where: { [Op.or]: { id: businessId, alias: businessId.replace("@", "") } } } ] 
            });
    }

    async findAllByUserId(){
        return await this.userBusiness.findAll({ where: { userId: this.cls.get("userId") }, include: [{model: Business, attributes: ["name", "alias", "_alias"]}] });
    }

    async findOneByUserId(){
        const biz = await this.userBusiness.sequelize?.query(loadSQL("user-business-is-single"), {
            type: QueryTypes.SELECT,
            replacements: {
                userId: this.cls.get("userId")
            }
        });

        return biz?.[0];
    }

    async findBooleanUserInBusiness(): Promise<boolean> {
        const count = await this.userBusiness.count({ where: { userId: this.cls.get("userId") } });
        return (count >= 1);
    }

    async findAllByBusinessId(){
        return await this.userBusiness.findAll({ where: { businessId: this.cls.get("businessId") } });
    }


}
