import { BeforeCreate, BelongsTo, Column, ForeignKey, Model, Table } from "sequelize-typescript";
import { v4 } from "uuid";

import { ListingPlan } from "./listing-plan.model";
import { genUUID } from "src/+utils/common";

@Table
export class ListingPlanDimension extends Model {

    @Column({defaultValue: 0, primaryKey: true})
    id: string;

    @Column
    size: number;

    @Column
    unit: string;

    @BeforeCreate
    static beforeInstanceCreate(model: any){
        model.id = genUUID();
    }

    @ForeignKey(()=> ListingPlan)
    listingPlanId: string;

    @BelongsTo(()=> ListingPlan)
    plan: ListingPlan;


}
