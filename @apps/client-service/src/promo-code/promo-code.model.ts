import { BeforeCreate, BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { v4 } from "uuid";
import { Business } from "../business/business.model";
import { genUUID } from "src/+utils/common";

@Table
export class PromoCode extends Model {

    @Column({defaultValue: 0, primaryKey: true})
    id: string;

    @Column
    code: string;

    @Column
    discount: string;

    @Column({type: DataType.VIRTUAL})
    get discountAmount(){
        return this.discount;
    }

    @Column
    usageLimit: number;

    @Column
    validFrom: string;

    @Column
    expiresAt: string;

    @BeforeCreate
    static beforeInstanceCreate(model: any){
        model.id = genUUID();
    }

    @ForeignKey(()=> Business)
    businessId: string;

    @BelongsTo(()=> Business)
    business: Business;
}