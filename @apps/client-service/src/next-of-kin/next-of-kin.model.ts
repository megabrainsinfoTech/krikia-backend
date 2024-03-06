import { BeforeCreate, Column, DataType, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import { User } from "../user/user.model";
import { v4 } from "uuid";
import { genUUID } from "src/+utils/common";

@Table
export class NextOfKin extends Model {

    @Column({defaultValue: 0, primaryKey: true})
    id: string;

    @Column
    firstName: string;

    @Column
    lastName: string;

    @Column
    gender: Gender;

    @Column
    email: string;

    @Column
    phone: string;

    @Column
    relationship: string;

    @BeforeCreate
    static beforeInstanceCreate(model: any){
        model.id = genUUID();
    }

    @ForeignKey(()=> User)
    userId: string;

    // @BelongsTo(()=> User)
    // user: User;
}
