import { IncomeSource, type Bucket } from "@/Util/classes/IncomeSource"
import { Util } from "@/Util/util"
import { createContext, useState } from "react"



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

    const [incomeSources, setIncomeSources] = useState<Map<string, IncomeSource>>(new Map())
    const [buckets, setBuckets] = useState<Map<string, Bucket>>(new Map())

    function addIncomeSource(incomeSource: IncomeSource){
        const newMap = Util.updateMap(incomeSources, incomeSource.name, incomeSource)
        setIncomeSources(newMap)
    }
    function addBucket(bucket: Bucket){
        const newMap = Util.updateMap(buckets, bucket.bucket.name, bucket)
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
