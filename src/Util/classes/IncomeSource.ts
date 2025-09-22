import{ PaymentType, type IPayment, type ISimulatable, type IncomeDataType, type Source } from "../types";
import { isSameDay} from "date-fns";
import { Util } from "../util";
import { Bucket } from "./Bucket";



export class IncomeSource implements ISimulatable{
    sourceData: IncomeDataType
    currentAmount: number = 0
    destinationBuckets: Bucket[] = []

    constructor(incomeSourceData: IncomeDataType){
        this.sourceData = {
            ...incomeSourceData,
            id: incomeSourceData.id ?? crypto.randomUUID()
        }
    }

    public step(date: Date): IPayment[]{
        let {nextIncurralDate, incomeAmount, id, incomeFrequency} = this.sourceData
        if(!isSameDay(date, new Date(nextIncurralDate))) return []
        this.sourceData.nextIncurralDate = Util.getNextDate(new Date(nextIncurralDate), incomeFrequency).toISOString()
        this.currentAmount = this.sourceData.incomeAmount

        const payments: IPayment[] = []
        for(const bucket of this.destinationBuckets){
            const paymentAmount = bucket.getMoneyAllocated(incomeAmount, this.currentAmount, this.sourceData.id!, "")
            if(paymentAmount <= 0) continue

            this.currentAmount -= paymentAmount
            bucket.addMoney(paymentAmount)
            payments.push({sourceId: id!, destinationId: bucket.bucket.id!, amount: paymentAmount, paymentType: PaymentType.Incoming})
        }

        return payments
    }
    public addDependantBucket(bucket: Bucket){
        this.destinationBuckets = this.destinationBuckets.filter(b => b.bucket.id != bucket.bucket.id)
        this.destinationBuckets.push(bucket)
    }
    public deleteBucket(id: string){
        this.destinationBuckets = this.destinationBuckets.filter(b => b.bucket.id != id)
    }
    public getAllocatedData(allocations: Source[], excludeSourceId: string){
        const allAllocations: Map<string, Source> = new Map()

        let totalAllocated = 0 
        for(const bucket of this.destinationBuckets){
            bucket.getAllocations(this.sourceData.id!).forEach(a => allAllocations.set(a.id, a))
        }
        allocations.forEach(a => {
            allAllocations.set(a.id, a);
        });
        allAllocations.delete(excludeSourceId)
        totalAllocated += Array.from(allAllocations.values()).reduce((a, c) => a + this.getAllocationPrice(c), 0)

        return {allocatedAmount: totalAllocated, unAllocatedAmount: this.sourceData.incomeAmount - totalAllocated}
    }
    public getAllocatedDataWithTemp(allocations: Source[], tempSource: Source, excludeSourceId: string){
        const data = this.getAllocatedData(allocations, excludeSourceId)
        const price = this.getAllocationPrice(tempSource)

        return {allocatedAmount: data.allocatedAmount + price, unAllocatedAmount: data.unAllocatedAmount - price}
    }
    public canAffordAllocation(allocations: Source[], excludeSourceId: string): boolean{
        const {unAllocatedAmount} = this.getAllocatedData(allocations, excludeSourceId)
        return unAllocatedAmount >= 0
    }
    public getAllocationPrice(allocation: Source){
        if(allocation.isPercentage){
            return (this.sourceData.incomeAmount * (allocation.allocation/100))
        }
        return allocation.allocation
    }
}
