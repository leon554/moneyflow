import { IncurralFrequency, type BucketType, type IPayment, type ISimulatable } from "../types";
import { isSameDay} from "date-fns";
import { Util } from "../util";

export class IncomeSource implements ISimulatable{

    name: string
    amount: number
    currentAmount: number = 0
    nextIncurralData: Date
    incomeFrequency: IncurralFrequency
    destinationBuckets: Bucket[] = []

    constructor(name: string, amount: number, incomeFrequency: IncurralFrequency, nextIncurralDate: Date = new Date()){
        this.name = name
        this.amount = amount
        this.incomeFrequency = incomeFrequency
        this.nextIncurralData = nextIncurralDate
    }

    public step(date: Date): IPayment[]{
        if(!isSameDay(date, this.nextIncurralData)) return []
        this.nextIncurralData = Util.getNextDate(this.nextIncurralData, this.incomeFrequency)

        const payments: IPayment[] = []
        for(const bucket of this.destinationBuckets){
            const paymentAmount = bucket.getMoneyAllocated(this.amount, this.currentAmount)
            if(paymentAmount <= 0) continue

            this.currentAmount -= paymentAmount
            bucket.addMoney(paymentAmount)
            payments.push({source: this.name, destination: bucket.bucket.name, amount: paymentAmount})
        }

        return []
    }
    public addDestinationBucket(bucket: Bucket){
        this.destinationBuckets.push(bucket)
    }
}

export class Bucket implements ISimulatable{

    bucket: BucketType

    constructor(bucket: BucketType, incomeSources: Map<string, IncomeSource>){
        this.bucket =  {...bucket}
        const incomeSource = incomeSources.get(this.bucket.sourceName)
        if(!incomeSource) return
        incomeSource.addDestinationBucket(this)
    }

    public step(date: Date): IPayment[]{
        return []
    }

    public getMoneyAllocated(moneyEarned: number, moneyLeft: number){
        if(this.bucket.percentageAllocation){
            return this.getMoneyAllocatedPercentage(moneyEarned, moneyLeft)
        }
        else{
            return this.getMoneyAllocatedFixed(moneyLeft)
        }
    }

    private getMoneyAllocatedPercentage(moneyEarned: number, moneyLeft: number){
        const percent = this.bucket.allocation
        const moneyRequested = moneyEarned * percent
        return (moneyRequested > moneyLeft) ? moneyLeft : moneyRequested
    }
    private getMoneyAllocatedFixed(moneyLeft: number){
        const moneyRequested = this.bucket.allocation
        return (moneyRequested > moneyLeft) ? moneyLeft : moneyRequested
    }
    public addMoney(amount: number){
        this.bucket.amount += amount
    }
    public removeMoney(amount: number){
        this.bucket.amount -= amount
    }
}