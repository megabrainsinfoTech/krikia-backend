import { BeforeBulkCreate, BeforeCreate, BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Listing } from "../listing/listing.model";
import { v4 } from "uuid";
import { genUUID } from "src/+utils/common";

@Table
export class ListingLocation extends Model {

    @Column({defaultValue: 0, primaryKey: true})
    id: string;

    @Column({ allowNull: true })
    country: string;

    @Column({ allowNull: true })
    state: string;

    @Column({ allowNull: true})
    city: string;

    @Column({ allowNull: true})
    address: string;

    @BeforeCreate
    static beforeInstanceCreate(listingLocation: any){
        listingLocation.id = genUUID();
    }

    @BeforeBulkCreate
    static beforeInstanceBulkCreate(models: any[]){
        models.forEach(model => model.id = genUUID());
    } 

    @Column({ allowNull: true})
    longitude: string;

    @Column({ allowNull: true})
    latitude: string;

    @ForeignKey(()=> Listing)
    listingId: string;

    @BelongsTo(()=> Listing)
    listing: Listing;
}