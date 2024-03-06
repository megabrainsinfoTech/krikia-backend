import { BeforeCreate, BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Listing } from "../listing/listing.model";
import { v4 } from "uuid";
import { genUUID } from "src/+utils/common";

@Table
export class Shop extends Model {

    @Column({defaultValue: 0, primaryKey: true})
    id: string;

    @Column
    size: string;

    @BeforeCreate
    static beforeInstanceCreate(model: any){
        model.id = genUUID();
    }

    @ForeignKey(()=> Listing)
    listingId: string;

    @BelongsTo(()=> Listing)
    listing: Listing;
}