import { BeforeCreate, BelongsTo, Column, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import { Business } from "../business/business.model";
import { v4 } from "uuid";
import { Image } from "./image.model";
import { genUUID } from "src/+utils/common";

@Table
export class ImageLabel extends Model {
    @Column({defaultValue: 0, primaryKey: true})
    id: string;

    @Column
    label: string;
    
    @BeforeCreate
    static beforeInstanceCreate(imageLabel: any){
        imageLabel.id = genUUID();
    }

    @ForeignKey(()=> Business)
    businessId: string;

    @BelongsTo(()=> Business)
    business: Business;

    @HasMany(()=> Image)
    images: Image[];

}