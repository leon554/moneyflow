import useLocalStorage from "@/hooks/useLocalStorage"
import { IncomeSource } from "@/Util/classes/IncomeSource"
import type {SystemData, BillData,  BucketDataType,  IncomeDataType,  IPayment,  SimulationType, Source } from "@/Util/types"
import { AccountType } from "@/Util/types"
import { Util } from "@/Util/util"
import { createContext, useEffect, useRef, useState } from "react"
import { Bucket } from "@/Util/classes/Bucket"
import { Bill } from "@/Util/classes/Bill"
import { useReactFlow } from "@xyflow/react"
import useSimulation from "@/hooks/useSimulation"
import type{ Dispatch, SetStateAction } from "react";

interface DataType{
    incomeSources: Map<string, IncomeSource>
    buckets: Map<string, Bucket>
    bills: Map<string, Bill>
    hydrated: boolean,
    simTimeoutId: React.RefObject<NodeJS.Timeout | null> | null
    updated: boolean
    simulation: SimulationType | null,
    systemData: SystemData[]
    setSystemData: (systemData: SystemData[]) => void
    selectedSystem: string
    setSelectedSystem: Dispatch<SetStateAction<string>>

    addIncomeSource: (incomeSource: IncomeSource) => void
    addBucket: (bucket: Bucket) => void
    addBill: (bill: Bill) => void

    deleteIncomeSource: (id: string) => void
    deleteBucket: (id: string) => void
    deleteBill: (id: string) => void

    step: (date: Date) => IPayment[]
    resetBuckets: () => void
    addSourcesToBucket: (bucketId: string, sources: Source[]) => void
    setUpdated: Dispatch<SetStateAction<boolean>>;
}

const defaultValues: DataType = {
    incomeSources: new Map<string, IncomeSource>(),
    buckets: new Map<string, Bucket>(),
    bills: new Map<string, Bill>(),
    hydrated: false,
    simTimeoutId:null,
    updated: false,
    simulation: null,
    systemData: [],
    setSystemData: () => null,
    selectedSystem: "",
    setSelectedSystem: () => null,

    addIncomeSource: () => null,
    addBucket: () => null,
    addBill: () => null,

    deleteIncomeSource: () => null,
    deleteBucket: () => null,
    deleteBill: () => null,

    step: () => [],
    resetBuckets: () => null,
    addSourcesToBucket: () => null,
    setUpdated: () => null
}

export const dataContext = createContext<DataType>(defaultValues)


interface Props{
    children: React.ReactNode
}
export default function DataProvider({children}: Props) {

    const [incomeSourceData, setIncomeSourceData] = useLocalStorage<IncomeDataType[]>("incomeSourceData", [])
    const [bucketData, setBucketData] = useLocalStorage<BucketDataType[]>("bucketData", [])
    const [billData, setBillData] = useLocalStorage<BillData[]>("billData", [])
    const [systemData, setSystemData] = useLocalStorage<SystemData[]>("systemData", [])
    const [selectedSystem, setSelectedSystem] = useLocalStorage("selectedSystem", "")

    const [incomeSources, setIncomeSources] = useState<Map<string, IncomeSource>>(new Map())
    const [buckets, setBuckets] = useState<Map<string, Bucket>>(new Map())
    const [bills, setBills] = useState<Map<string, Bill>>(new Map())
    const [hydrated, setHydrated] = useState(false)
    const [updated, setUpdated] = useState(false)
    const simTimeoutId = useRef<NodeJS.Timeout | null>(null)
    
    const simulation = useSimulation({step, resetBuckets, simTimeoutId})

    useEffect(() => {
        hydrateFromLocalStorage()
        setHydrated(true)
        setUpdated(!updated)
    }, [selectedSystem])

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
        setIncomeSourceData([...incomeSourceData, incomeSource.sourceData])
        setIncomeSources(newMap)
        setUpdated(!updated)
    }
    function addBucket(bucket: Bucket){
        const newMap = Util.updateMap(buckets, bucket.bucket.id!, bucket)
        setBucketData([...bucketData, bucket.bucket])
        setBuckets(newMap)
        setUpdated(!updated)
    }
    function addBill(bill: Bill){
        const newMap = Util.updateMap(bills, bill.billData.id!, bill)
        setBillData([...billData, bill.billData])
        setBills(newMap)
        setUpdated(!updated)
    }

    function hydrateFromLocalStorage(){
        const incomeMap = new Map<string, IncomeSource>()
        const bucketMap = new Map<string, Bucket>()
        const billMap = new Map<string, Bill>()

        incomeSourceData.filter(s => s.systemId == selectedSystem).forEach(s => {
            const source = {...s}
            source.nextIncurralDate = Util.adjustDate(new Date(source.nextIncurralDate), source.incomeFrequency).getTime()
            incomeMap.set(source.id!, new IncomeSource(source))
        })
        bucketData.filter(b => b.systemId == selectedSystem).forEach(b=> {
            const bucketData = {...b}
            if(bucketData.accountType != AccountType.CashAccount){
                bucketData.nextIncurralDate = Util.adjustDate(new Date(bucketData.nextIncurralDate), bucketData.compoundFrequency).getTime()
            }
            bucketMap.set(bucketData.id!, new Bucket(bucketData, incomeMap))
        })
        billData.filter(b => b.systemId == selectedSystem).forEach(b => {
            const bill = {...b}
            bill.nextIncurralDate = Util.adjustDate(new Date(bill.nextIncurralDate), bill.frequency).getTime()
            billMap.set(bill.id!, new Bill(bill))
        })
        setIncomeSources(new Map(incomeMap))
        setBuckets(new Map(bucketMap))
        setBills(new Map(billMap))
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
            incomeSource.deleteBucketId(id)
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

        const incomePayments =  incomeSourceArr.map(source => source.step(date, buckets)).flat()
        const billPayments = billArr.map(bill => bill.step(date, buckets)).flat()
        bucketArr.map(bucket => bucket.step(date))

        const newIncomeSourceMap = new Map(incomeSourceArr.map(i => [i.sourceData.id!, i]))
        const newBillMap = new Map(billArr.map(b => [b.billData.id!, b]))

        simTimeoutId.current = setTimeout(() => {
            setIncomeSources(newIncomeSourceMap)
            setBuckets(new Map(buckets))
            setBills(newBillMap)
        }, 900)

        const payments = [incomePayments, billPayments].flat()

        payments.forEach(p => {
            playEdge(`${p.sourceId}-${p.destinationId}`, p.amount)
        })
        return payments
    }


    function resetBuckets(){
        simTimeoutId.current && clearTimeout(simTimeoutId.current)
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
                    updated,
                    simulation,
                    systemData,
                    setSystemData,
                    selectedSystem,
                    setSelectedSystem,
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
                    setUpdated
                }}>
                {children}
            </dataContext.Provider>
        </>
    )
}
