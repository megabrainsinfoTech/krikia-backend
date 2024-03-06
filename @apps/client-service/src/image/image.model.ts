import { BeforeBulkCreate, BeforeCreate, BelongsTo, Column, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import { v4 } from "uuid";
import { ImageLabel } from "./image-label.model";
import { ListingImage } from "./listing-image-model";
import { BusinessImage } from "./business-image.model";
import { genUUID } from "src/+utils/common";

@Table
export class Image extends Model {
    @Column({defaultValue: 0, primaryKey: true})
    id: string;

    @Column
    url: string;

    @Column
    description: string;
    
    @BeforeCreate
    static beforeInstanceCreate(image: any){
        image.id = genUUID();
    }

    @BeforeBulkCreate
    static beforeInstanceBulkCreate(images: any[]){
        images.forEach(image => image.id = genUUID());
    }

    @ForeignKey(()=> ImageLabel)
    labelId: string;

    @BelongsTo(()=> ImageLabel)
    label: ImageLabel;

    @HasMany(()=> ListingImage)
    listingImages: ListingImage[];

    @HasMany(()=> BusinessImage)
    businessImages: BusinessImage[];

}