import { BeforeBulkCreate, BeforeCreate, BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { v4 } from "uuid";
import { ListingPlan } from "src/listing-plan/listing-plan.model";
import { genUUID } from "src/+utils/common";

@Table
export class House extends Model {

    @Column({defaultValue: 0, primaryKey: true})
    id: string;

    @Column
    type: string;

    @Column
    floorLevel: number;

    @Column({type: DataType.SMALLINT})
    bedrooms: number;

    @Column({type: DataType.SMALLINT})
    bathrooms: number;

    @Column({type: DataType.SMALLINT})
    toilets: number;

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
    listingPlan: ListingPlan;
}