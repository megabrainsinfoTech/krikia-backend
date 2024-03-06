import { BeforeBulkCreate, BeforeCreate, BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import { ListingPlan } from "../listing-plan/listing-plan.model";
import { v4 } from "uuid";
import { Purchase } from "src/purchase/purchase.model";
import { genUUID } from "src/+utils/common";

@Table
export class ListingPlanOption extends Model {

    @Column({defaultValue: 0, primaryKey: true})
    id: string;

    @Column
    price: number;

    @Column
    paymentDuration: number;

    @Column
    paymentInterval: string;

    @Column
    discount: string;

    @Column
    sellerNote: string;

    @Column
    initialDeposit: string;

    @Column({type: DataType.JSON, defaultValue: []})
    paymentFrequencies: any[];

    @Column({type: DataType.ENUM("NGN", "USD")})
    currency: 'NGN' | 'USD';

    @BeforeCreate
    static beforeInstanceCreate(model: any){
        model.id = genUUID();
    }

    @BeforeBulkCreate
    static beforeInstanceBulkCreate(models: any[]){
        models.forEach(model => model.id = genUUID());
    }


    @ForeignKey(()=> ListingPlan)
    listingPlanId: string;

    @BelongsTo(()=> ListingPlan)
    plan: ListingPlan

    @HasMany(()=> Purchase)
    purchases: Purchase[];

    @Column({type: DataType.VIRTUAL})
    get discountPrice(): number {
        return 0
    };
}
