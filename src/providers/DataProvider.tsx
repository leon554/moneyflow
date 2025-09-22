import useLocalStorage from "@/hooks/useLocalStorage"
import { IncomeSource } from "@/Util/classes/IncomeSource"
import { type BillData, type BucketDataType, type IncomeDataType, type IPayment, type Source } from "@/Util/types"
import { Util } from "@/Util/util"
import { createContext, useEffect, useRef, useState } from "react"
import { Bucket } from "@/Util/classes/Bucket"
import { Bill } from "@/Util/classes/Bill"
import { useReactFlow } from "@xyflow/react"


interface DataType{
    incomeSources: Map<string, IncomeSource>
    buckets: Map<string, Bucket>
    bills: Map<string, Bill>
    hydrated: boolean,
    simTimeoutId: React.RefObject<NodeJS.Timeout | null> | null

    addIncomeSource: (incomeSource: IncomeSource) => void
    addBucket: (bucket: Bucket) => void
    addBill: (bill: Bill) => void

    deleteIncomeSource: (id: string) => void
    deleteBucket: (id: string) => void
    deleteBill: (id: string) => void

    step: (date: Date) => IPayment[]
    resetBuckets: () => void
    addSourcesToBucket: (bucketId: string, sources: Source[]) => void
}

const defaultValues: DataType = {
    incomeSources: new Map<string, IncomeSource>(),
    buckets: new Map<string, Bucket>(),
    bills: new Map<string, Bill>(),
    hydrated: false,
    simTimeoutId:null,

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
    const [hydrated, setHydrated] = useState(false)
    const simTimeoutId = useRef<NodeJS.Timeout | null>(null)
    

    useEffect(() => {
        hydrateFromLocalStorage()
        setHydrated(true)
    }, [])

    const { setEdges } = useReactFlow();

    const playEdge = (edgeId: string, amount: number) => {
        setEdges((edges) =>
            edges.map((edges) =>
            edges.id === edgeId ? { ...edges, data: { ...edges.data, play: true, amount } } : edges
            )
        );
    };

    function addIncomeSource(incomeSource: IncomeSource){
        const newMap = Util.updateMap(incomeSources, incomeSource.sourceData.id!, incomeSource)
        setIncomeSourceData(Array.from(newMap.values()).map(v => v.sourceData))
        setIncomeSources(newMap)
    }
    function addBucket(bucket: Bucket){
        const newMap = Util.updateMap(buckets, bucket.bucket.id!, bucket)
        setBucketData(Array.from(newMap.values()).map(v => v.bucket))
        setBuckets(newMap)
    }
    function addBill(bill: Bill){
        const newMap = Util.updateMap(bills, bill.billData.id!, bill)
        setBillData(Array.from(newMap.values()).map(b => b.billData))
        setBills(newMap)
    }

    function hydrateFromLocalStorage(){
        const incomeMap = new Map<string, IncomeSource>()
        const bucketMap = new Map<string, Bucket>()
        const billMap = new Map<string, Bill>()


        incomeSourceData.forEach(source => {
            incomeMap.set(source.id!, new IncomeSource(source))
        })
        bucketData.forEach(bucketData => {
            bucketMap.set(bucketData.id!, new Bucket(bucketData, incomeMap))
        })
        billData.forEach(bill => {
            billMap.set(bill.id!, new Bill(bill))
        })

        setIncomeSources(incomeMap)
        setBuckets(bucketMap)
        setBills(billMap)
    }

    function addSourcesToBucket(bucketId: string, sources: Source[]){
        const bucket = buckets.get(bucketId)
        if(!bucket) {new Error("Bucket id doesn't exist"); return}

        bucket.addSources(sources, Array.from(incomeSources.values()))
        setBuckets(new Map(buckets))
        setIncomeSources(new Map(incomeSources))
    }
    function deleteBucket(id: string){
        const newMap = new Map(buckets)
        newMap.delete(id)

        const incomeSourceMap = new Map(Array.from(incomeSources.values()).map(incomeSource => {
            incomeSource.deleteBucket(id)
            return incomeSource
        }).map(incSrc => [incSrc.sourceData.id!, incSrc]))


        setIncomeSources(incomeSourceMap)
        setBucketData([...Array.from(newMap.values()).map(v => v.bucket)])
        setBuckets(newMap)
    }
    function deleteIncomeSource(id: string){
        const newMap = new Map(incomeSources)
        newMap.delete(id)
        setIncomeSourceData([...Array.from(newMap.values()).map(v => v.sourceData)])
        setIncomeSources(newMap)
    }
    function deleteBill(id: string){
        const newMap = new Map(bills)
        newMap.delete(id)

        setBills(newMap)
        setBillData([...Array.from(newMap.values()).map(b => b.billData)])
    }

    function step(date: Date): IPayment[]{
        const incomeSourceArr = Array.from(incomeSources.values())
        const bucketArr = Array.from(buckets.values())
        const billArr = Array.from(bills.values())

        const incomePayments =  incomeSourceArr.map(source => source.step(date)).flat()
        const billPayments = billArr.map(bill => bill.step(date, buckets)).flat()
        bucketArr.map(bucket => bucket.step(date))

        const newIncomeSourceMap = new Map(incomeSourceArr.map(i => [i.sourceData.id!, i]))
        const newBillMap = new Map(billArr.map(b => [b.billData.id!, b]))

        simTimeoutId.current = setTimeout(() => {
            setIncomeSources(newIncomeSourceMap)
            setBuckets(new Map(buckets))
            setBills(newBillMap)
        }, 900)

        const pyaments = [incomePayments, billPayments].flat()

        pyaments.forEach(p => {
            playEdge(`${p.sourceId}-${p.destinationId}`, p.amount)
        })
        return pyaments
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
                    hydrated,
                    addIncomeSource,
                    addBucket,
                    addBill,
                    deleteBucket,
                    deleteIncomeSource,
                    step,
                    resetBuckets,
                    addSourcesToBucket,
                    deleteBill,
                    simTimeoutId,
                }}>
                {children}
            </dataContext.Provider>
        </>
    )
}
