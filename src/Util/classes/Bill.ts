import { PaymentType, type BillData, type IPayment, type ISimulatable } from "../types";
import { isSameDay } from "date-fns";
import { Util } from "../util";
import type { Bucket } from "./Bucket";

export class Bill implements ISimulatable{
    billData: BillData

    constructor(billData: BillData){
        this.billData = {...billData, id: billData.id ?? crypto.randomUUID()}
    }


    public step(date: Date, mutate: boolean, buckets: Map<string, Bucket>): IPayment[]{
        if(!isSameDay(date, new Date(this.billData.nextIncurralDate))) return []
        mutate && (
            this.billData.nextIncurralDate = Util.getNextDate(
                new Date(this.billData.nextIncurralDate), 
                this.billData.frequency).getTime()
        )

        const sourceBucket = buckets.get(this.billData.sourceBucketId)
        if(!sourceBucket) {throw new Error("Bill source bucket is not defined");}

        if(mutate){
            const payment = sourceBucket.requestMoneyFromBucket(this.billData.amount)
            this.billData.balance += payment
        }

        return [{sourceId: this.billData.sourceBucketId!, amount: this.billData.amount, destinationId: this.billData.id!, paymentType: PaymentType.Outgoing}]
    }


    public getBillAmount(){
        return this.billData.amount
    }
    public addMoney(amount: number){
        this.billData.balance += amount
    }
}