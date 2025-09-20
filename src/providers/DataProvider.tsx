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

    deleteBucket: (name: string) => void
    deleteIncomeSource: (name: string) => void
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

    deleteBucket: () => null,
    deleteIncomeSource: () => null,
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
            billMap.set(bill.name, new Bill(bill, Array.from(bucketMap.values())))
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

    function step(date: Date): IPayment[]{
        const incomeSourceArr = Array.from(incomeSources.values())
        const payments =  incomeSourceArr.map(source => source.step(date)).flat()

        const newIncomeSourceMap = new Map<string, IncomeSource>()
        incomeSourceArr.forEach(s => newIncomeSourceMap.set(s.sourceData.name, s))
        setIncomeSources(newIncomeSourceMap)
        setBuckets(new Map(buckets))
        return payments
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
                    addSourcesToBucket
                }}>
                {children}
            </dataContext.Provider>
        </>
    )
}
