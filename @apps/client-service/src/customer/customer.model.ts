import { BeforeCreate, BelongsTo, Column, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import { Business } from "../business/business.model";
import { User } from "../user/user.model";
import { v4 } from "uuid";
import { genUUID } from "src/+utils/common";

@Table
export class Customer extends Model {
    
    @Column({defaultValue: 0, primaryKey: true})
    id: string;
    
    @BeforeCreate
    static beforeInstanceCreate(customer: any){
        customer.id = genUUID();
    }

    @ForeignKey(()=> User)
    userId: string;

    @ForeignKey(()=> Business)
    businessId: string;

    @BelongsTo(()=> User)
    user: User;

    @BelongsTo(()=> Business)
    business: Business
}