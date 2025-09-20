import type { BillData } from "../types";
import type { Bucket } from "./Bucket";


export class Bill{
    billData: BillData

    constructor(billData: BillData, buckets: Bucket[]){
        this.billData = {...billData}
        const sourceBucket = buckets.find(b => b.bucket.name == billData.sourceBucketName)
        if(!sourceBucket) {new Error("Source bucket is not found"); return}
        sourceBucket.addBill(this)
    }

    public getBillAmount(){
        return this.billData.amount
    }
    public addMoney(amount: number){
        this.billData.balance += amount
    }
}