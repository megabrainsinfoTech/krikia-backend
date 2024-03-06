import { BeforeCreate, BelongsTo, BelongsToMany, Column, ForeignKey, Model, Table } from "sequelize-typescript";
import { Business } from "../business/business.model";
import { v4 } from "uuid";
import { Image } from "./image.model";
import { genUUID } from "src/+utils/common";

@Table
export class BusinessImage extends Model {
    @Column({defaultValue: 0, primaryKey: true})
    id: string;
    
    @BeforeCreate
    static beforeInstanceCreate(businessImage: any){
        businessImage.id = genUUID();
    }

    @ForeignKey(()=> Business)
    businessId: string;

    @ForeignKey(()=> Image)
    imageId: string;

    @BelongsTo(()=> Image)
    image: Image;

    @BelongsTo(()=> Business)
    business: Business;

}