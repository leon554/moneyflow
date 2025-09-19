import type{ Allocation, IPayment, ISimulatable, IncomeDataType } from "../types";
import { isSameDay} from "date-fns";
import { Util } from "../util";
import { Bucket } from "./Bucket";



export class IncomeSource implements ISimulatable{
    sourceData: IncomeDataType
    currentAmount: number = 0
    destinationBuckets: Bucket[] = []

    constructor(incomeSourceData: IncomeDataType){
       this.sourceData = {...incomeSourceData}
    }

    public step(date: Date): IPayment[]{
        let {nextIncurralData, incomeAmount, name, incomeFrequency} = this.sourceData
        if(!isSameDay(date, new Date(nextIncurralData))) return []
        this.sourceData.nextIncurralData = Util.getNextDate(new Date(nextIncurralData), incomeFrequency).toISOString()
        this.currentAmount = this.sourceData.incomeAmount

        const payments: IPayment[] = []
        for(const bucket of this.destinationBuckets){
            const paymentAmount = bucket.getMoneyAllocated(incomeAmount, this.currentAmount, this.sourceData.name)
            if(paymentAmount <= 0) continue

            this.currentAmount -= paymentAmount
            bucket.addMoney(paymentAmount)
            payments.push({source: name, destination: bucket.bucket.name, amount: paymentAmount})
        }

        return payments
    }
    public addDestinationBucket(bucket: Bucket){
        this.destinationBuckets.push(bucket)
    }
    public getAllocatedData(allocation?: Allocation){
        let totalAllocated = 0 + ((allocation) ? this.getAllocationPrice(allocation) : 0)
        for(const bucket of this.destinationBuckets){
            totalAllocated += bucket.getMoneyAllocated(this.sourceData.incomeAmount, this.sourceData.incomeAmount, this.sourceData.name)
        }
        return {allocatedAmount: totalAllocated, unAllocatedAmount: this.sourceData.incomeAmount - totalAllocated}
    }
    public canAffordAllocation(allocation: Allocation): boolean{
        const {unAllocatedAmount} = this.getAllocatedData()
        if(allocation.isPercentage){
            return (this.sourceData.incomeAmount * (allocation.allocation/100)) <= unAllocatedAmount
        }
        return allocation.allocation <= unAllocatedAmount
    }
    public getAllocationPrice(allocation: Allocation){
        if(allocation.isPercentage){
            return (this.sourceData.incomeAmount * (allocation.allocation/100))
        }
        return allocation.allocation
    }
}
