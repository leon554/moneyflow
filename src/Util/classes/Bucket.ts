import { type ISimulatable, type BucketDataType, type IPayment, type Source, AccountType } from "../types"
import { IncomeSource } from "./IncomeSource"
import { isSameDay } from "date-fns"
import { Util } from "../util"

export class Bucket implements ISimulatable{

    bucket: BucketDataType
    balanceOverTime: Map<string, number> = new Map()


    constructor(bucket: BucketDataType, incomeSources: Map<string, IncomeSource>){
        this.bucket =  {...bucket, id: bucket.id ?? crypto.randomUUID()}
        const incomeSourceArr = bucket.sources.map(s => incomeSources.get(s.incomeSourceId)).filter(s => s != undefined)
        const usedIds = new Set<string>()
        incomeSourceArr.forEach(source => {
            if(!usedIds.has(source.sourceData.id!)){
                source.addDependantBucketId(this.bucket.id!)
                usedIds.add(source.sourceData.id!)
            }
        })
    }

    public step(date: Date): IPayment[]{
        
        if(this.bucket.accountType == AccountType.SavingsAccount && isSameDay(date, new Date(this.bucket.nextIncurralDate))){
            this.bucket.nextIncurralDate = Util.getNextDate(new Date(this.bucket.nextIncurralDate), this.bucket.compoundFrequency).toISOString()
            
            const rate = Util.getInterestRateFromFreq(this.bucket.compoundFrequency, this.bucket.interest/100)
            const interestEarned = this.bucket.balance * rate
            this.bucket.balance += interestEarned
        }
        if(this.bucket.accountType == AccountType.DeptAccount && isSameDay(date, new Date(this.bucket.nextIncurralDate))){
            
            this.bucket.nextIncurralDate = Util.getNextDate(new Date(this.bucket.nextIncurralDate), this.bucket.compoundFrequency).toISOString()
            const rate = Util.getInterestRateFromFreq(this.bucket.compoundFrequency, this.bucket.interest/100)
            const interestToBePaid = this.bucket.balance * rate
            this.bucket.balance -= Math.abs(interestToBePaid)
        }

        this.balanceOverTime.set(date.toISOString(), this.bucket.balance)

        return []
    }


    public getMoneyAllocated(moneyEarned: number, moneyLeft: number, sourceId: string, excludeSourceId: string){
        let totalMoneyWanted = 0
        this.bucket.sources.forEach(source => {
            if(source.incomeSourceId != sourceId || source.id == excludeSourceId)return
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
    public getAllocations(sourceId: string){
        return this.bucket.sources.filter(s => s.incomeSourceId == sourceId)
    }
    private getMoneyAllocatedPercentage(moneyEarned: number, moneyLeft: number, source: Source){
        const percent = source.allocation/100
        const moneyRequested = moneyEarned * percent
        return (moneyRequested > moneyLeft) ? moneyLeft : moneyRequested
    }
    private getMoneyAllocatedFixed(moneyLeft: number, source: Source){
        const moneyRequested = source.allocation
        return (moneyRequested > moneyLeft) ? moneyLeft : moneyRequested
    }

    public requestMoneyFromBucket(amount: number){
        this.bucket.balance -= amount
        return amount
    }   

    public addSources(sources: Source[], incomeSources: IncomeSource[]){
        const usedIds = new Set<string>()
        incomeSources.forEach(source => {
            if(usedIds.has(source.sourceData.id!)) return
            source.addDependantBucketId(this.bucket.id!)
            usedIds.add(source.sourceData.id!)
        })
        this.bucket.sources = [...this.bucket.sources, ...sources]
    }
    public addMoney(amount: number){
        this.bucket.balance += amount
    }
    public removeMoney(amount: number){
        this.bucket.balance -= amount
    }
}