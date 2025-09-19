import type { ISimulatable, BucketDataType, IPayment, Source } from "../types"
import { IncomeSource } from "./IncomeSource"

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
    //add so it gets the allocated money per source so add source argument
    public getMoneyAllocated(moneyEarned: number, moneyLeft: number, sourceName: string){
        let totalMoneyWanted = 0
        this.bucket.sources.forEach(source => {
            if(source.sourceName == sourceName){
                let moneyWanted = 0
                if(source.isPercentage){
                    moneyWanted = this.getMoneyAllocatedPercentage(moneyEarned, moneyLeft, source)
                }
                else{
                    moneyWanted = this.getMoneyAllocatedFixed(moneyLeft, source)
                }
                moneyLeft -= moneyWanted
                totalMoneyWanted += moneyWanted
            }
        })
        return totalMoneyWanted
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
    public addMoney(amount: number){
        this.bucket.balance += amount
    }
    public removeMoney(amount: number){
        this.bucket.balance -= amount
    }
}