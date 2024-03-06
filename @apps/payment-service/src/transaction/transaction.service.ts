import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import Transaction from './transaction.model';
import { CreateTransactionDTO } from './transaction.dto';

@Injectable()
export class TransactionService {
    constructor(@InjectModel(Transaction) private readonly model: typeof Transaction){}

    async create(createBody: CreateTransactionDTO){
        return await this.model.create();
    }
}
