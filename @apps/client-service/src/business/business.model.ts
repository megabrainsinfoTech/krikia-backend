import { AfterUpdate, BeforeCreate, Column, DataType, HasMany, Model, Table } from "sequelize-typescript";
import { v4 } from "uuid";
import { BusinessAccountStatus } from "./business.interface";
import { Customer } from "../customer/customer.model";
import { Listing } from "../listing/listing.model";
import { UserBusiness } from "../user-business/user-business.model";
import { ImageLabel } from "../image/image-label.model";
import { BusinessImage } from "../image/business-image.model";
import { PromoCode } from "../promo-code/promo-code.model";
import { genUUID } from "src/+utils/common";

@Table
export class Business extends Model {
    @Column({defaultValue: 0, primaryKey: true})
    id: string;

    @Column
    email: string;

    @Column
    profession: string;

    @Column
    name: string;

    @Column
    alias: string;

    @Column({type: DataType.VIRTUAL})
    get _alias(): string {
        return `@${this.alias?.replace("@", "")}`
    }

    @Column
    regNumber: string;

    @Column
    yearEstablished: string;

    @Column
    aboutUs: string;

    @Column({type: DataType.JSON})
    officeLocations: string[];

    @Column
    logoUrl: string;

    @Column
    bannerUrl: string;

    @Column({defaultValue: ""})
    bid: string;

    @Column({defaultValue: ""})
    fnxAccountAddress: string;

    @Column({defaultValue: "Active"})
    status: BusinessAccountStatus;

    @BeforeCreate
    static beforeInstanceCreate(business: any){
        business.id = genUUID();
    }

    @HasMany(()=> Listing)
    listings: Listing[];

    @HasMany(()=> Customer)
    customers: Customer[];

    @HasMany(()=> UserBusiness)
    employees: UserBusiness[];

    @HasMany(()=> ImageLabel)
    imageLabels: ImageLabel[];

    @HasMany(()=> BusinessImage)
    album: BusinessImage[];

    @HasMany(()=> PromoCode)
    promoCodes: PromoCode[];

    @AfterUpdate
    static async afterBusinessUpdate(){

    }
}
