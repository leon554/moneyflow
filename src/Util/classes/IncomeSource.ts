import type{ IPayment, ISimulatable, IncomeDataType } from "../types";
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
        let {nextIncurralData, incomeAmount: amount, name, incomeFrequency} = this.sourceData
        if(!isSameDay(date, new Date(nextIncurralData))) return []
        this.sourceData.nextIncurralData = Util.getNextDate(new Date(nextIncurralData), incomeFrequency).toISOString()
        this.currentAmount = this.sourceData.incomeAmount

        const payments: IPayment[] = []
        for(const bucket of this.destinationBuckets){
            const paymentAmount = bucket.getMoneyAllocated(amount, this.currentAmount)
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
}
