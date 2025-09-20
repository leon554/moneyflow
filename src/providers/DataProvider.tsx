import useLocalStorage from "@/hooks/useLocalStorage"
import { IncomeSource } from "@/Util/classes/IncomeSource"
import { type BillData, type BucketDataType, type IncomeDataType, type IPayment, type Source } from "@/Util/types"
import { Util } from "@/Util/util"
import { createContext, useEffect, useState } from "react"
import { Bucket } from "@/Util/classes/Bucket"
import { Bill } from "@/Util/classes/Bill"



interface DataType{
    incomeSources: Map<string, IncomeSource>
    buckets: Map<string, Bucket>
    bills: Map<string, Bill>

    addIncomeSource: (incomeSource: IncomeSource) => void
    addBucket: (bucket: Bucket) => void
    addBill: (bill: Bill) => void

    deleteIncomeSource: (name: string) => void
    deleteBucket: (name: string) => void
    deleteBill: (name: string) => void

    step: (date: Date) => IPayment[]
    resetBuckets: () => void
    addSourcesToBucket: (bucketName: string, sources: Source[]) => void
}

const defaultValues: DataType = {
    incomeSources: new Map<string, IncomeSource>(),
    buckets: new Map<string, Bucket>(),
    bills: new Map<string, Bill>(),

    addIncomeSource: () => null,
    addBucket: () => null,
    addBill: () => null,

    deleteIncomeSource: () => null,
    deleteBucket: () => null,
    deleteBill: () => null,

    step: () => [],
    resetBuckets: () => null,
    addSourcesToBucket: () => null
}

export const dataContext = createContext<DataType>(defaultValues)


interface Props{
    children: React.ReactNode
}
export default function DataProvider({children}: Props) {

    const [incomeSourceData, setIncomeSourceData] = useLocalStorage<IncomeDataType[]>("incomeSourceData", [])
    const [bucketData, setBucketData] = useLocalStorage<BucketDataType[]>("bucketData", [])
    const [billData, setBillData] = useLocalStorage<BillData[]>("billData", [])

    const [incomeSources, setIncomeSources] = useState<Map<string, IncomeSource>>(new Map())
    const [buckets, setBuckets] = useState<Map<string, Bucket>>(new Map())
    const [bills, setBills] = useState<Map<string, Bill>>(new Map())

    useEffect(() => {
        hydrateFromLocalStorage()
    }, [])


    function addIncomeSource(incomeSource: IncomeSource){
        const newMap = Util.updateMap(incomeSources, incomeSource.sourceData.name, incomeSource)
        setIncomeSourceData(Array.from(newMap.values()).map(v => v.sourceData))
        setIncomeSources(newMap)
    }
    function addBucket(bucket: Bucket){
        const newMap = Util.updateMap(buckets, bucket.bucket.name, bucket)
        setBucketData(Array.from(newMap.values()).map(v => v.bucket))
        setBuckets(newMap)
    }
    function addBill(bill: Bill){
        const newMap = Util.updateMap(bills, bill.billData.name, bill)
        setBillData(Array.from(newMap.values()).map(b => b.billData))
        setBills(newMap)
    }

    function hydrateFromLocalStorage(){
        const incomeMap = new Map<string, IncomeSource>()
        const bucketMap = new Map<string, Bucket>()
        const billMap = new Map<string, Bill>()


        incomeSourceData.forEach(source => {
            incomeMap.set(source.name, new IncomeSource(source))
        })
        bucketData.forEach(bucketData => {
            bucketMap.set(bucketData.name, new Bucket(bucketData, incomeMap))
        })
        billData.forEach(bill => {
            billMap.set(bill.name, new Bill(bill))
        })

        setIncomeSources(incomeMap)
        setBuckets(bucketMap)
        setBills(billMap)
    }

    function addSourcesToBucket(bucketName: string, sources: Source[]){
        const bucket = buckets.get(bucketName)
        if(!bucket) {new Error("Bucket name doesn't exist"); return}

        bucket.addSources(sources, Array.from(incomeSources.values()))
        setBuckets(new Map(buckets))
        setIncomeSources(new Map(incomeSources))
    }
    function deleteBucket(name: string){
        const newMap = new Map(buckets)
        newMap.delete(name)

        const incomeSourceMap = new Map(Array.from(incomeSources.values()).map(incomeSource => {
            incomeSource.deleteBucket(name)
            return incomeSource
        }).map(incSrc => [incSrc.sourceData.name, incSrc]))


        setIncomeSources(incomeSourceMap)
        setBucketData([...Array.from(newMap.values()).map(v => v.bucket)])
        setBuckets(newMap)
    }
    function deleteIncomeSource(name: string){
        const newMap = new Map(incomeSources)
        newMap.delete(name)
        setIncomeSourceData([...Array.from(newMap.values()).map(v => v.sourceData)])
        setIncomeSources(newMap)
    }
    function deleteBill(name: string){
        const newMap = new Map(bills)
        newMap.delete(name)

        setBills(newMap)
        setBillData([...Array.from(newMap.values()).map(b => b.billData)])
    }

    function step(date: Date): IPayment[]{
        const incomeSourceArr = Array.from(incomeSources.values())
        const billArr = Array.from(bills.values())

        const incomePayments =  incomeSourceArr.map(source => source.step(date)).flat()
        const billPayments = billArr.map(bill => bill.step(date, buckets)).flat()

        const newIncomeSourceMap = new Map(incomeSourceArr.map(i => [i.sourceData.name, i]))
        const newBillMap = new Map(billArr.map(b => [b.billData.name, b]))

        setIncomeSources(newIncomeSourceMap)
        setBuckets(new Map(buckets))
        setBills(newBillMap)

        return [incomePayments, billPayments].flat()
    }


    function resetBuckets(){
        hydrateFromLocalStorage()
    }



    return (
        <>
            <dataContext.Provider 
                value={{
                    incomeSources,
                    buckets,
                    bills,
                    addIncomeSource,
                    addBucket,
                    addBill,
                    deleteBucket,
                    deleteIncomeSource,
                    step,
                    resetBuckets,
                    addSourcesToBucket,
                    deleteBill
                }}>
                {children}
            </dataContext.Provider>
        </>
    )
}
