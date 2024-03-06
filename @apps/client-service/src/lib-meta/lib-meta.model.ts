import { BeforeCreate, BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { v4 } from "uuid";
import { Business } from "../business/business.model";
import { genUUID } from "src/+utils/common";

@Table
export class LibMeta extends Model {

    @Column({defaultValue: 0, primaryKey: true})
    id: string;

    @Column({type: DataType.ENUM("Title", "Size")})
    category: string;

    @Column
    value: string;
    
    @BeforeCreate
    static beforeInstanceCreate(libMeta: any){
        libMeta.id = genUUID();
    }

    @ForeignKey(()=> Business)
    businessId: string;

    @BelongsTo(()=> Business)
    business: Business;
}