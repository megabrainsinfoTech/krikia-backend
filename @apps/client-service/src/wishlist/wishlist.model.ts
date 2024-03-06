import { BeforeCreate, BelongsTo, Column, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import { v4 } from "uuid";
import { Listing } from "../listing/listing.model";
import { User } from "../user/user.model";
import { SharedWishlist } from "../shared-wishlist/shared-wishlist.model";
import { genUUID } from "src/+utils/common";

@Table
export class Wishlist extends Model {

    @Column({defaultValue: 0, primaryKey: true})
    id: string;

    @BeforeCreate
    static beforeInstanceCreate(model: any){
        model.id = genUUID();
    }

    @ForeignKey(()=> User)
    userId: string;

    @ForeignKey(()=> Listing)
    listingId: string;

    @BelongsTo(()=> User)
    user: User;

    @BelongsTo(()=> Listing)
    listing: Listing;

    @HasMany(()=> SharedWishlist)
    shared: SharedWishlist[];
}