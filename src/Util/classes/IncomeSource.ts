import{ PaymentType, type Allocation, type IPayment, type ISimulatable, type IncomeDataType } from "../types";
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
            const paymentAmount = bucket.getMoneyAllocated(incomeAmount, this.currentAmount, this.sourceData.id!)
            if(paymentAmount <= 0) continue

            this.currentAmount -= paymentAmount
            bucket.addMoney(paymentAmount)
            payments.push({sourceId: id!, destinationId: bucket.bucket.id!, amount: paymentAmount, paymentType: PaymentType.Incoming})
        }

        return payments
    }
    public addDependantBucket(bucket: Bucket){
        if(this.destinationBuckets.some(b => b.bucket.id! == bucket.bucket.id)) return
        this.destinationBuckets.push(bucket)
    }
    public deleteBucket(id: string){
        this.destinationBuckets = this.destinationBuckets.filter(b => b.bucket.id != id)
    }
    public getAllocatedData(allocation?: Allocation[]){
        let totalAllocated = 0 + ((allocation?.length != 0 && allocation) ? allocation.reduce((a, c) => a + this.getAllocationPrice(c), 0) : 0)
        for(const bucket of this.destinationBuckets){
            totalAllocated += bucket.getMoneyAllocated(this.sourceData.incomeAmount, this.sourceData.incomeAmount, this.sourceData.id!)
        }
        return {allocatedAmount: totalAllocated, unAllocatedAmount: this.sourceData.incomeAmount - totalAllocated}
    }
    public canAffordAllocation(allocations: Allocation[]): boolean{
        const {unAllocatedAmount} = this.getAllocatedData()
        let totalAllocationAmount = 0
        allocations.forEach(allocation => {
            if(allocation.isPercentage){
                totalAllocationAmount += (this.sourceData.incomeAmount * (allocation.allocation/100)) 
            }
            else{
                totalAllocationAmount += allocation.allocation
            }
        })
        return totalAllocationAmount <= unAllocatedAmount
    }
    public getAllocationPrice(allocation: Allocation){
        if(allocation.isPercentage){
            return (this.sourceData.incomeAmount * (allocation.allocation/100))
        }
        return allocation.allocation
    }
}
