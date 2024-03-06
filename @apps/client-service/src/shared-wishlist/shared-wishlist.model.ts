import { BeforeCreate, BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { v4 } from "uuid";
import { Wishlist } from "../wishlist/wishlist.model";
import { genUUID } from "src/+utils/common";

@Table
export class SharedWishlist extends Model {

    @Column({defaultValue: 0, primaryKey: true})
    id: string;

    @Column({type: DataType.JSON})
    payload: string | string[];

    @BeforeCreate
    static beforeInstanceCreate(model: any){
        model.id = genUUID();
    }

    @ForeignKey(()=> Wishlist)
    wishlistId: string;

    @BelongsTo(()=> Wishlist)
    wishlist: Wishlist
}