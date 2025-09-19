import useLocalStorage from "@/hooks/useLocalStorage"
import { IncomeSource } from "@/Util/classes/IncomeSource"
import type { BucketDataType, IncomeDataType, IPayment } from "@/Util/types"
import { Util } from "@/Util/util"
import { createContext, useEffect, useState } from "react"
import { Bucket } from "@/Util/classes/Bucket"



interface DataType{
    incomeSources: Map<string, IncomeSource>
    buckets: Map<string, Bucket>
    addIncomeSource: (incomeSource: IncomeSource) => void
    addBucket: (bucket: Bucket) => void
    deleteBucket: (name: string) => void
    deleteIncomeSource: (name: string) => void
    step: (date: Date) => IPayment[]
    resetBuckets: () => void
}

const defaultValues: DataType = {
    incomeSources: new Map<string, IncomeSource>(),
    buckets: new Map<string, Bucket>(),
    addIncomeSource: () => null,
    addBucket: () => null,
    deleteBucket: () => null,
    deleteIncomeSource: () => null,
    step: () => [],
    resetBuckets: () => null
}

export const dataContext = createContext<DataType>(defaultValues)


interface Props{
    children: React.ReactNode
}
export default function DataProvider({children}: Props) {

    const [incomeSourceData, setIncomeSourceData] = useLocalStorage<IncomeDataType[]>("incomeSourceData", [])
    const [bucketData, setBucketData] = useLocalStorage<BucketDataType[]>("bucketData", [])
    const [incomeSources, setIncomeSources] = useState<Map<string, IncomeSource>>(new Map())
    const [buckets, setBuckets] = useState<Map<string, Bucket>>(new Map())

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
    function deleteBucket(name: string){
        const newMap = new Map(buckets)
        newMap.delete(name)
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

    function hydrateFromLocalStorage(){
        const incomeMap = new Map<string, IncomeSource>()
        const bucketMap = new Map<string, Bucket>()
        incomeSourceData.forEach(source => {
            incomeMap.set(source.name, new IncomeSource(source))
        })
        bucketData.forEach(bucketData => {
            bucketMap.set(bucketData.name, new Bucket(bucketData, incomeMap))
        })
        setIncomeSources(incomeMap)
        setBuckets(bucketMap)
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
                    addIncomeSource,
                    addBucket,
                    deleteBucket,
                    deleteIncomeSource,
                    step,
                    resetBuckets
                }}>
                {children}
            </dataContext.Provider>
        </>
    )
}
