import { BeforeCreate, Column, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import { Business } from "../business/business.model";
import { Review } from "../review/review.model";
import { v4 } from "uuid";
import { genUUID } from "src/+utils/common";

@Table
export class ReviewReply extends Model {

    @Column({defaultValue: 0, primaryKey: true})
    id: string;

    @Column
    comment: string;

    @BeforeCreate
    static beforeInstanceCreate(model: any){
        model.id = genUUID();
    }

    @ForeignKey(()=> Review)
    reviewId: string;

    @ForeignKey(()=> Business)
    businessId: string;
}