import type { ISimulatable, BucketDataType, IPayment, Source } from "../types"
import { IncomeSource } from "./IncomeSource"
import { Bill } from "./Bill"

export class Bucket implements ISimulatable{

    bucket: BucketDataType
    bills: Bill[] = []

    constructor(bucket: BucketDataType, incomeSources: Map<string, IncomeSource>){
        this.bucket =  {...bucket}
        const incomeSourceArr = bucket.sources.map(s => incomeSources.get(s.sourceName)).filter(s => s != undefined)
        const usedNames = new Set<string>()
        incomeSourceArr.forEach(source => {
            if(!usedNames.has(source.sourceData.name)){
                source.addDependantBucket(this)
                usedNames.add(source.sourceData.name)
            }
        })
    }

    public step(_: Date): IPayment[]{
        const payments: IPayment[] = []
        this.bills.forEach(bill => {
            const amountDue = bill.getBillAmount()
            this.bucket.balance -= amountDue
            bill.addMoney(amountDue)
            payments.push({source: this.bucket.name, amount: amountDue, destination: bill.billData.name})
        })
        return payments
    }

    public addBill(bill: Bill){
        if(this.bills.some(b => b.billData.name == bill.billData.name))
        this.bills = [...this.bills, bill]
    }

    public getMoneyAllocated(moneyEarned: number, moneyLeft: number, sourceName: string){
        let totalMoneyWanted = 0
        this.bucket.sources.forEach(source => {
            if(source.sourceName != sourceName)return
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
        const percent = source.allocation/100
        const moneyRequested = moneyEarned * percent
        return (moneyRequested > moneyLeft) ? moneyLeft : moneyRequested
    }
    private getMoneyAllocatedFixed(moneyLeft: number, source: Source){
        const moneyRequested = source.allocation
        return (moneyRequested > moneyLeft) ? moneyLeft : moneyRequested
    }
    public addSources(sources: Source[], incomeSources: IncomeSource[]){
        const usedNames = new Set<string>()
        incomeSources.forEach(source => {
            if(usedNames.has(source.sourceData.name)) return
            source.addDependantBucket(this)
            usedNames.add(source.sourceData.name)
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