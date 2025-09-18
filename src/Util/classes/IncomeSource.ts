import type{BucketDataType, IPayment, ISimulatable, Source, IncomeDataType } from "../types";
import { isSameDay} from "date-fns";
import { Util } from "../util";



export class IncomeSource implements ISimulatable{
    sourceData: IncomeDataType
    currentAmount: number = 0
    destinationBuckets: Bucket[] = []

    constructor(incomeSourceData: IncomeDataType){
       this.sourceData = {...incomeSourceData}
    }

    public step(date: Date): IPayment[]{
        let {nextIncurralData, incomeAmount: amount, name, incomeFrequency} = this.sourceData
        if(!isSameDay(date, nextIncurralData)) return []
        nextIncurralData = Util.getNextDate(new Date(nextIncurralData), incomeFrequency).toISOString()

        const payments: IPayment[] = []
        for(const bucket of this.destinationBuckets){
            const paymentAmount = bucket.getMoneyAllocated(amount, this.currentAmount)
            if(paymentAmount <= 0) continue

            this.currentAmount -= paymentAmount
            bucket.addMoney(paymentAmount)
            payments.push({source: name, destination: bucket.bucket.name, amount: paymentAmount})
        }

        return []
    }
    public addDestinationBucket(bucket: Bucket){
        this.destinationBuckets.push(bucket)
    }
}

export class Bucket implements ISimulatable{

    bucket: BucketDataType

    constructor(bucket: BucketDataType, incomeSources: Map<string, IncomeSource>){
        this.bucket =  {...bucket}
        const incomeSourceArr = bucket.sources.map(s => incomeSources.get(s.sourceName)).filter(s => s != undefined)
        const usedNames = new Set<string>()
        incomeSourceArr.forEach(source => {
            if(!usedNames.has(source.sourceData.name)){
                source.addDestinationBucket(this)
                usedNames.add(source.sourceData.name)
            }
        })
    }

    public step(_: Date): IPayment[]{
        return []
    }

    public getMoneyAllocated(moneyEarned: number, moneyLeft: number){
        let totalMoneyWanted = 0
        this.bucket.sources.forEach(source => {
            let moneyWanted = 0
            if(source.isPercentage){
                moneyWanted = this.getMoneyAllocatedPercentage(moneyEarned, moneyLeft, source)
            }
            else{
                moneyWanted = this.getMoneyAllocatedFixed(moneyLeft, source)
            }
            moneyLeft -= moneyWanted
            totalMoneyWanted += moneyWanted
        })
        return totalMoneyWanted
    }

    private getMoneyAllocatedPercentage(moneyEarned: number, moneyLeft: number, source: Source){
        const percent = source.allocation
        const moneyRequested = moneyEarned * percent
        return (moneyRequested > moneyLeft) ? moneyLeft : moneyRequested
    }
    private getMoneyAllocatedFixed(moneyLeft: number, source: Source){
        const moneyRequested = source.allocation
        return (moneyRequested > moneyLeft) ? moneyLeft : moneyRequested
    }
    public addMoney(amount: number){
        this.bucket.balance += amount
    }
    public removeMoney(amount: number){
        this.bucket.balance -= amount
    }
}