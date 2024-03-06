import { BeforeCreate, BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Listing } from "../listing/listing.model";
import { User } from "../user/user.model";
import { v4 } from "uuid";
import { genUUID } from "src/+utils/common";

@Table
export class Review extends Model {

    @Column({defaultValue: 0, primaryKey: true})
    id: string;

    @Column({type: DataType.SMALLINT})
    rating: number;

    @Column
    comment: string;

    @Column
    reviewFor: string;

    @BeforeCreate
    static beforeInstanceCreate(model: any){
        model.id = genUUID();
    }

    @ForeignKey(()=> Listing)
    listingId: string;

    @ForeignKey(()=> User)
    userId: string;

    @BelongsTo(()=> Listing)
    listing: Listing;

    @BelongsTo(()=> User)
    user: User;
}