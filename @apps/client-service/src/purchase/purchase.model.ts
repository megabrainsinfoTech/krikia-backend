import { AfterCreate, AfterUpdate, BeforeCreate, Column, ForeignKey, Model, Table } from "sequelize-typescript";
import { User } from "../user/user.model";
import { v4 } from "uuid";
import { ListingPlanOption } from "../listing-plan-option/listing-plan-option.model";
import dayjs, { ManipulateType } from "dayjs";
import { genUUID } from "src/+utils/common";

@Table
export class Purchase extends Model {

    @Column({defaultValue: 0, primaryKey: true})
    id: string;

    @ForeignKey(()=> User)
    userId: string;

    @ForeignKey(()=> ListingPlanOption)
    listingPlanOptionId: string;

    @Column
    paidAmount: number;

    @Column
    totalAmount: number;

    @Column
    nextPayDate: string;

    @Column
    nextPayAmount: number;

    @Column
    paymentStatus: PaymentStatus;

    @Column
    paymentFrequency: PaymentFrequency;

    @Column
    paymentDuration: number;

    @Column
    expectedPayEndDate: string;

    @Column
    lastPaidDate: string;

    @Column
    lastPaidOrdinal: number;

    @Column({defaultValue: "1"})
    totalPaidCardinals: string;

    @BeforeCreate
    static beforeInstanceCreate(model: any){
        model.id = genUUID();
    }

    @AfterCreate
    static async afterPurchaseCreate(purchase: any){
        
         if(purchase.paymentFrequency){
             // Set value for nextPayAmount after subtracting initialApy from totalPay and dividing by the remaining periods let
            const remainingAmount = purchase.totalAmount - purchase.paidAmount;
            const frequency =  purchase.paymentFrequency.replace("ly", "").toLowerCase();
            // const periodFromSecond = dayjs().add(1, frequency as ManipulateType);
            const periodsLeft = purchase.paymentDuration-1;

            purchase.nextPayAmount = remainingAmount/periodsLeft;

            // Set date to nextPayDate
            const date = dayjs().add(1, frequency as ManipulateType);
            purchase.nextPayDate = date.toString();

            // Save for expectedPayEndDate
            purchase.expectedPayEndDate = dayjs().add(purchase.paymentDuration, frequency as ManipulateType).toString();
         }

    }

    @AfterUpdate
    static async afterPurchaseUpdate(purchase: any){

        // Update nextPayDate after every update
        const latestPaidCardinal = Number((purchase.totalPaidCardinals?.split(","))?.at(-1));
  
        // Calculate from the first period by the latest paid cardinal
        const frequency =  purchase.paymentFrequency.replace("ly", "").toLowerCase();
        const periodFromSecond = dayjs().add(1, frequency as ManipulateType);
        const date = periodFromSecond.add(latestPaidCardinal, frequency as ManipulateType);
  
        // Set date to nextPayDate
        purchase.nextPayDate = date.toString();
  
    }
}