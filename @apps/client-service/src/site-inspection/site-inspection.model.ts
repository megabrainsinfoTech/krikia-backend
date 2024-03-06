import { BeforeCreate, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Listing } from "../listing/listing.model";
import { User } from "../user/user.model";
import { v4 } from "uuid";
import { genUUID } from "src/+utils/common";

@Table
export class SiteInspection extends Model {

    @Column({defaultValue: 0, primaryKey: true})
    id: string;

    @Column
    date: Date;

    @Column({type: DataType.ENUM("Onsite", "Video")})
    type: "Onsite" | "Video";

    @Column
    time: string;

    @BeforeCreate
    static beforeInstanceCreate(model: any){
        model.id = genUUID();
    }

    @ForeignKey(()=> Listing)
    listingId: string;

    @ForeignKey(()=> User)
    userId: string;
}