import useLocalStorage from "@/hooks/useLocalStorage"
import { Bucket, IncomeSource } from "@/Util/classes/IncomeSource"
import type { BucketDataType, IncomeDataType } from "@/Util/types"
import { Util } from "@/Util/util"
import { createContext, useEffect, useState } from "react"



interface DataType{
    incomeSources: Map<string, IncomeSource>
    buckets: Map<string, Bucket>
    addIncomeSource: (incomeSource: IncomeSource) => void
    addBucket: (bucket: Bucket) => void
}

const defaultValues: DataType = {
    incomeSources: new Map<string, IncomeSource>(),
    buckets: new Map<string, Bucket>(),
    addIncomeSource: () => null,
    addBucket: () => null
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
    return (
        <>
            <dataContext.Provider 
                value={{
                    incomeSources,
                    buckets,
                    addIncomeSource,
                    addBucket
                }}>
                {children}
            </dataContext.Provider>
        </>
    )
}
