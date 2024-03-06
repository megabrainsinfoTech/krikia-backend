import { Injectable } from '@nestjs/common';
import { CreateCustomerDTO } from './customer.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Customer } from './customer.model';
import { User } from '../user/user.model';
import { Purchase } from '../purchase/purchase.model';

@Injectable()
export class CustomerService {

    constructor(@InjectModel(Customer) private readonly customer: typeof Customer){}

    async create(createBody: CreateCustomerDTO){
       await this.customer.create(createBody as any);
        return { message: "Customer created successfully" };
    }

    async findByBusinessId(businessId: string, id: string){
        return await this.customer.findOne({ where: { id, businessId }, include: [ { model: User, include: [Purchase] } ] });
    }

    async findAllByBusinessId(businessId: string){
        return await this.customer.findAll({ where: { businessId }, include: [ { model: User, include: [Purchase] } ] });
    }

   async findByUserId(userId: string){
       return await this.customer.findOne({ where: { userId }, include: [ { model: User, include: [Purchase] } ] });
    }

   async findAllByUserId(userId: string){
        return await this.customer.findAll({ where: { userId } });
    }


}
