import { BeforeBulkCreate, BeforeCreate, BelongsTo, BelongsToMany, Column, ForeignKey, Model, Table } from "sequelize-typescript";
import { v4 } from "uuid";
import { Listing } from "../listing/listing.model";
import { Image } from "./image.model";
import { genUUID } from "src/+utils/common";

@Table
export class ListingImage extends Model {
    @Column({defaultValue: 0, primaryKey: true})
    id: string;
    
    @BeforeCreate
    static beforeInstanceCreate(listingImage: any){
        listingImage.id = genUUID();
    }

    @BeforeBulkCreate
    static beforeInstanceBulkCreate(models: any[]){
        models.forEach(model => model.id = genUUID());
    }

    @ForeignKey(()=> Image)
    imageId: string;

    @ForeignKey(()=> Listing)
    listingId: string;

    @BelongsTo(()=> Image)
    image: Image;

    @BelongsTo(()=> Listing)
    listing: Listing;

}