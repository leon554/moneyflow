import{ PaymentType, type IPayment, type ISimulatable, type IncomeDataType, type Source } from "../types";
import { isSameDay} from "date-fns";
import { Util } from "../util";
import { Bucket } from "./Bucket";



export class IncomeSource implements ISimulatable{
    sourceData: IncomeDataType
    currentAmount: number = 0
    totalPaid: number = 0
    destinationBucketsIds: string[] = []

    constructor(incomeSourceData: IncomeDataType){
        this.sourceData = {
            ...incomeSourceData,
            id: incomeSourceData.id ?? crypto.randomUUID()
        }
    }

    public step(date: Date, buckets: Map<string, Bucket>): IPayment[]{
        let {nextIncurralDate, incomeAmount, id, incomeFrequency} = this.sourceData
        if(!isSameDay(date, new Date(nextIncurralDate))) return []
        this.sourceData.nextIncurralDate = Util.getNextDate(new Date(nextIncurralDate), incomeFrequency).getTime()
        this.currentAmount = this.sourceData.incomeAmount

        const payments: IPayment[] = []
        for(const bucketId of this.destinationBucketsIds){
            const bucket = buckets.get(bucketId)
            if(!bucket) throw new Error("Id used in income source step function does't reference a valid bucket")

            const paymentAmount = bucket.getMoneyAllocated(incomeAmount, this.currentAmount, this.sourceData.id!, "")
            if(paymentAmount <= 0) continue

            this.currentAmount -= paymentAmount
            this.totalPaid += paymentAmount
            bucket.addMoney(paymentAmount)
            payments.push({sourceId: id!, destinationId: bucket.bucket.id!, amount: paymentAmount, paymentType: PaymentType.Incoming})
        }

        return payments
    }

    public addDependantBucketId(id: string){
        this.destinationBucketsIds = this.destinationBucketsIds.filter(bucketId => bucketId != id)
        this.destinationBucketsIds.push(id)
    }
    public deleteBucketId(id: string){
        this.destinationBucketsIds = this.destinationBucketsIds.filter(bucketId => bucketId != id)
    }
    public getAllocatedData(allocations: Source[], excludeSourceId: string, buckets: Map<string, Bucket>){
        const allAllocations: Map<string, Source> = new Map()

        let totalAllocated = 0 
        for(const bucketId of this.destinationBucketsIds){
            const bucket = buckets.get(bucketId)
            if(!bucket) throw new Error("Id is invalid reference to bucket")
            bucket.getAllocations(this.sourceData.id!).forEach(a => allAllocations.set(a.id, a))
        }
        allocations.forEach(a => {
            allAllocations.set(a.id, a);
        });
        allAllocations.delete(excludeSourceId)

        const allocationDistribution: {name: string, allocated: number}[] = []

        totalAllocated += Array.from(allAllocations.values()).reduce((a, c) => {
            const allocationPrice = this.getAllocationPrice(c)
            const bucket =  buckets.get(c.bucketTargetId)
            if(!bucket) return a + allocationPrice
            allocationDistribution.push({name: buckets.get(c.bucketTargetId)!.bucket.name, allocated: allocationPrice})
            return a + allocationPrice
        }, 0)

        return {
            allocatedAmount: totalAllocated, 
            unAllocatedAmount: this.sourceData.incomeAmount - totalAllocated,
            allocationDistribution
        }
    }
    public getAllocatedDataWithTemp(allocations: Source[], tempSource: Source, excludeSourceId: string, buckets: Map<string, Bucket>){
        const data = this.getAllocatedData(allocations, excludeSourceId, buckets)
        const price = this.getAllocationPrice(tempSource)
        return {allocatedAmount: data.allocatedAmount + price, unAllocatedAmount: data.unAllocatedAmount - price}
    }
    public canAffordAllocation(allocations: Source[], excludeSourceId: string, buckets: Map<string, Bucket>): boolean{
        const {unAllocatedAmount} = this.getAllocatedData(allocations, excludeSourceId, buckets)
        return unAllocatedAmount >= 0
    }
    public getAllocationPrice(allocation: Source){
        if(allocation.isPercentage){
            return (this.sourceData.incomeAmount * (allocation.allocation/100))
        }
        return allocation.allocation
    }
}
