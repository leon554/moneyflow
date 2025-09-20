import { PaymentType, type BillData, type IPayment, type ISimulatable } from "../types";
import { isSameDay } from "date-fns";
import { Util } from "../util";
import type { Bucket } from "./Bucket";

export class Bill implements ISimulatable{
    billData: BillData

    constructor(billData: BillData){
        this.billData = {...billData}
    }


    public step(date: Date, buckets: Map<string, Bucket>): IPayment[]{
        if(!isSameDay(date, new Date(this.billData.nextIncurralDate))) return []
        this.billData.nextIncurralDate = Util.getNextDate(new Date(this.billData.nextIncurralDate), this.billData.frequency).toISOString()

        const sourceBucket = buckets.get(this.billData.sourceBucketName)
        if(!sourceBucket) {new Error("Bill source bucket is not defined"); return []}

        const payment = sourceBucket.requestMoneyFromBucket(this.billData.amount)
        this.billData.balance += payment

        return [{source: sourceBucket.bucket.name, amount: payment, destination: this.billData.name, paymentType: PaymentType.Outgoing}]
    }


    public getBillAmount(){
        return this.billData.amount
    }
    public addMoney(amount: number){
        this.billData.balance += amount
    }
}