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
import { useLocation, useNavigate } from "react-router-dom"
import { BILL_KEY, BUCKET_KEY, INCOME_SOURCE_KEY, SELECTED_SYSTEM_KEY, SYSTEM_KEY } from "@/constants"

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
    hasProfile: boolean

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
    setHasProfile: Dispatch<SetStateAction<boolean>>;
    hydrateFromLocalStorage: () => void
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
    hasProfile: false,

    addIncomeSource: () => null,
    addBucket: () => null,
    addBill: () => null,

    deleteIncomeSource: () => null,
    deleteBucket: () => null,
    deleteBill: () => null,

    step: () => [],
    resetBuckets: () => null,
    addSourcesToBucket: () => null,
    setUpdated: () => null,
    setHasProfile: () => null,
    hydrateFromLocalStorage: () => null
}

export const dataContext = createContext<DataType>(defaultValues)


interface Props{
    children: React.ReactNode
}
export default function DataProvider({children}: Props) {

    const [incomeSourceData, setIncomeSourceData] = useLocalStorage<IncomeDataType[]>(INCOME_SOURCE_KEY, [])
    const [bucketData, setBucketData] = useLocalStorage<BucketDataType[]>(BUCKET_KEY, [])
    const [billData, setBillData] = useLocalStorage<BillData[]>(BILL_KEY, [])
    const [systemData, setSystemData] = useLocalStorage<SystemData[]>(SYSTEM_KEY, [])
    const [selectedSystem, setSelectedSystem] = useLocalStorage(SELECTED_SYSTEM_KEY, "")
    const [hasProfile, setHasProfile] = useLocalStorage("hasProfile", false)

    const [incomeSources, setIncomeSources] = useState<Map<string, IncomeSource>>(new Map())
    const [buckets, setBuckets] = useState<Map<string, Bucket>>(new Map())
    const [bills, setBills] = useState<Map<string, Bill>>(new Map())
    const [hydrated, setHydrated] = useState(false)
    const [updated, setUpdated] = useState(false)
    const simTimeoutId = useRef<NodeJS.Timeout | null>(null)
    
    const simulation = useSimulation({step, resetBuckets, simTimeoutId})
    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        hydrateFromLocalStorage()
    }, [selectedSystem])

    useEffect(() => {
        if(hasProfile && location.pathname == "/"){
            navigate("/home")
        }
        if(!hasProfile){
            navigate("/")
        }
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

        const filteredIncomeSources = incomeSourceData.filter(s => s.systemId == selectedSystem)
        const filteredBuckets = bucketData.filter(b => b.systemId == selectedSystem)
        const filteredBills = billData.filter(b => b.systemId == selectedSystem)

        filteredIncomeSources.forEach(s => {
            const source = {...s}
            source.nextIncurralDate = Util.adjustDate(new Date(source.nextIncurralDate), source.incomeFrequency).getTime()
            incomeMap.set(source.id!, new IncomeSource(source))
        })
        filteredBuckets.forEach(b=> {
            const bucketData = {...b}
            if(bucketData.accountType != AccountType.CashAccount){
                bucketData.nextIncurralDate = Util.adjustDate(new Date(bucketData.nextIncurralDate), bucketData.compoundFrequency).getTime()
            }
            bucketMap.set(bucketData.id!, new Bucket(bucketData, incomeMap))
        })
        filteredBills.forEach(b => {
            const bill = {...b}
            bill.nextIncurralDate = Util.adjustDate(new Date(bill.nextIncurralDate), bill.frequency).getTime()
            billMap.set(bill.id!, new Bill(bill))
        })

        setIncomeSources(new Map(incomeMap))
        setBuckets(new Map(bucketMap))
        setBills(new Map(billMap))
        setHydrated(true)
        setUpdated(!updated)
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
    function organizePayments(payments: IPayment[]){
        const map = new Map<string, IPayment[]>()
        payments.forEach(p => {
            const key = `${p.sourceId}${p.destinationId}`
            if(!map.has(key)){
                map.set(key, [])
            }
            map.get(key)!.push(p)
        })
        const organized = Array.from(map.values()).map(p => {
            const total = p.reduce((a, c) => a + c.amount, 0)
            return { ...p[0], amount: total }  // new object, same structure
        })
        return organized
    }
    function step(date: Date): IPayment[]{
        const incomeSourceArr = Array.from(incomeSources.values())
        const bucketArr = Array.from(buckets.values())
        const billArr = Array.from(bills.values())

        const incomePayments =  incomeSourceArr.map(source => source.step(date, false, buckets)).flat()
        const billPayments = billArr.map(bill => bill.step(date, false, buckets)).flat()
        const bucketPayments = bucketArr.map(bucket => bucket.step(date, false, buckets)).flat()

        console.log(bucketPayments)
        simTimeoutId.current = setTimeout(() => {
            incomeSourceArr.map(source => source.step(date, true, buckets))
            bucketArr.map(bucket => bucket.step(date, true, buckets))
            billArr.map(bill => bill.step(date, true, buckets))

            const newIncomeSourceMap = new Map(incomeSourceArr.map(i => [i.sourceData.id!, i]))
            const newBillMap = new Map(billArr.map(b => [b.billData.id!, b]))
            const newBucketMap = new Map(bucketArr.map(b => [b.bucket.id!, b]))

            setIncomeSources(newIncomeSourceMap)
            setBuckets(newBucketMap)
            setBills(newBillMap)
        }, 900)

        const payments = organizePayments([incomePayments, billPayments, bucketPayments].flat())

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
                    hasProfile,
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
                    setUpdated,
                    setHasProfile,
                    hydrateFromLocalStorage
                }}>
                {children}
            </dataContext.Provider>
        </>
    )
}
