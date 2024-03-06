import { BeforeBulkCreate, BeforeCreate, BelongsTo, Column, DataType, ForeignKey, HasMany, HasOne, Model, Table } from "sequelize-typescript";
import { Listing } from "../listing/listing.model";
import { v4 } from "uuid";
import { ListingPlanOption } from "../listing-plan-option/listing-plan-option.model";
import { ListingPlanDimension } from "./listing-plan-dim.model";
import { House } from "../listing-meta/house.model";
import { genUUID } from "src/+utils/common";

@Table
export class ListingPlan extends Model {

    @Column({defaultValue: 0, primaryKey: true})
    id: string;

    @Column
    name: string;

    @Column
    quantity: number;

    @Column
    price: number;

    @Column({allowNull: true})
    sellerNote: string;

    @Column
    discount: string;

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

    @BelongsTo(()=> Listing)
    listing: Listing;

    @ForeignKey(()=> Listing) 
    listingId: string;

    @HasOne(()=> ListingPlanDimension)
    dimension: ListingPlanDimension;

    @HasOne(()=> House)
    house: House;

    @HasMany(()=> ListingPlanOption)
    options: ListingPlanOption[];

    @Column({type: DataType.VIRTUAL})
    get discountPrice(): number {
        return 0;
    }

}
