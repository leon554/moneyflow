import type { Bucket } from "@/Util/classes/Bucket"
import Button from "../../primitives/Button"
import { AccountType, IncurralFrequency } from "@/Util/types"
import { Util } from "@/Util/util"
import { useContext} from "react"
import { dataContext } from "@/providers/DataProvider"
import BucketChart from "../../charts/BucketChart"
import LoanRepaymentInfo from "./LoanRepaymentInfo"
import SavingsSimulationInfo from "./SavingsSimulationInfo"

interface Props{
    bucket: Bucket
    setOpen: (open: boolean) => void
}
export default function BucketNodeModal({bucket, setOpen}: Props) {

    const data = useContext(dataContext)

    const allBuckets = Array.from(data.buckets.values())
    const reserveSourceBuckets = getReserveSourceBuckets(allBuckets.filter(b => b.bucket.bucketSourceId == bucket.bucket.id), allBuckets)!

    function getReserveSourceBuckets(previousLayer: Bucket[], allBuckets: Bucket[], visited = new Set<string>()): Bucket[] {
        const newLayer: Bucket[] = []

        for (const bucket of previousLayer) {
            if (visited.has(bucket.bucket.id!)) continue
            visited.add(bucket.bucket.id!)

            const newBuckets = allBuckets.filter(b => b.bucket.bucketSourceId == bucket.bucket.id && b.bucket.id != bucket.bucket.id)

            newLayer.push(...newBuckets)
        }

        if (newLayer.length === 0) {
            return [...visited].map(id => allBuckets.find(b => b.bucket.id == id)!)
        }
        return getReserveSourceBuckets(newLayer, allBuckets, visited)
    }

    const totalDailyObligation = Math.abs(reserveSourceBuckets.reduce((a, c) => {
        let netflow = (c.getDailyInFlow(data.incomeSources) - c.getDailyOutFlow(data.bills))
        netflow = netflow >= 0 ? 0 : netflow
        return a + netflow
    }, 0))
    const isReserveSource = reserveSourceBuckets.length > 0

    const outflow = bucket?.getDailyOutFlow(data.bills) + totalDailyObligation
    const inflow = bucket.bucket.bucketSourceId && (outflow > bucket?.getDailyInFlow(data.incomeSources)) ? 
        outflow  :
        bucket?.getDailyInFlow(data.incomeSources)
    const netflow = inflow - outflow

    return (
       <div className="bg-panel1 outline-1 outline-border rounded-md p-5 flex flex-col gap-1.5 max-w-[400px] w-[90%]"
            onClick={e => e.stopPropagation()}
        >
            <p className="text-title font-medium leading-none mb-1.5 flex items-center justify-between">
                {Util.capFirst(bucket!.bucket.name)} {isReserveSource ? <span className="bg-highlight text-xs h-4 flex items-center text-btn-text px-2 rounded-full ml-2">Reserve Bucket</span>  :""}
            </p>
            <hr className="text-border border-t w-full mt-2"/>
            <div className="flex flex-col gap-1.5  sm:max-h-[440px] max-h-[300px] overflow-y-scroll no-scrollbar pb-[1px] mb-2">

                <p className="text-xs text-title font-medium leading-none mb-1 mt-2">
                    Overview
                </p>
                <div className="grid sm:grid-cols-2 grid-cols-1 gap-y-1.5 gap-x-7">
                    <p className="text-xs text-subtext1 flex justify-between">
                        Balance: <span className="font-medium text-title">{Util.formatNum(bucket!.bucket.balance, true)}</span> 
                    </p>
                    <p className="text-xs text-subtext1 flex justify-between">
                        Goal: <span className="font-medium text-title">{Util.formatNum(bucket.bucket.targetBalance, true)}</span> 
                    </p>
                    {bucket!.bucket.accountType != AccountType.CashAccount ? 
                    <>
                        <p className="text-xs text-subtext1 flex justify-between">
                            Annual interest: {" "}
                            <span className="font-medium text-title">{bucket?.bucket.interest}%</span>
                        </p>
                        <p className="text-xs text-subtext1 flex justify-between">
                            Interest {bucket!.bucket.accountType == AccountType.SavingsAccount ? "earned: " : "payed: "}  
                            <span className="font-medium text-title">{Util.formatNum(Math.abs(bucket!.interestAmount), true)}</span> 
                        </p> 
                    </> : null}
                </div>
                <hr className="text-border border-t w-full mt-2"/>
                <p className="text-xs text-title font-medium leading-none mb-1 mt-2 flex items-center justify-between">
                    Incoming & Outgoing  
                </p>
                <div className="grid sm:grid-cols-2 grid-cols-1 gap-y-1.5 gap-x-7">
                    <p className="text-xs text-subtext1 flex justify-between">
                        Total in flow: <span className="font-medium text-green-300">{Util.formatNum(bucket.flowData.in, true)}</span>
                    </p>
                    <p className="text-xs text-subtext1 flex justify-between">
                        Total out flow: <span className="font-medium text-red-300">{Util.formatNum(bucket.flowData.out, true)}</span>
                    </p>
                    <p className="text-xs text-subtext1 flex justify-between">
                        Avg daily in flow: <span className="font-medium text-green-300">{Util.formatNum(inflow, true)}</span>
                    </p>
                    <p className="text-xs text-subtext1 flex justify-between">
                        Avg daily out flow: <span className="font-medium text-red-300">{Util.formatNum(outflow, true)}</span>
                    </p>
                    <p className="text-xs text-subtext1 flex justify-between">
                        Avg daily net flow: <span className="font-medium text-title">{Util.formatNum(netflow, true)}</span>
                    </p>
                    <p className="text-xs text-subtext1 flex justify-between">
                        Savings Rate: <span className="font-medium text-title">{Math.round(((netflow)/inflow)*100*100)/100}%</span>
                    </p>
                </div>
                {bucket.bucket.bucketSourceId ? 
                <>
                    <hr className="text-border border-t w-full mt-2"/>
                    <p className="text-xs text-title font-medium leading-none mb-1 mt-2">
                        Reserve 
                    </p>
                    <div className="grid grid-cols-1 gap-y-1.5 gap-x-7">
                        <p className="text-xs text-subtext1 flex justify-between">
                            Reserve Amount: <span className="font-medium text-title">{Util.formatNum(Number(bucket.bucket.reserveAmount), true)}</span>
                        </p>
                        <p className="text-xs text-subtext1 flex justify-between">
                            Reserve From: <span className="font-medium text-title">{Util.capFirst(data.buckets.get(bucket.bucket.bucketSourceId!)?.bucket.name ?? "")}</span>
                        </p>
                    </div>
                </>
                : null}
                
                {bucket!.bucket.accountType == AccountType.DeptAccount ? 
                <>
                    <LoanRepaymentInfo bucket={bucket} netflow={netflow} reservePayments={{amount: totalDailyObligation, nextIncurralDate: data.simulation?.date!, frequency: IncurralFrequency.daily}}/>
                </> : null}
                {bucket!.bucket.accountType == AccountType.SavingsAccount ? 
                <>
                   <SavingsSimulationInfo bucket={bucket} netflow={netflow} reservePayments={{amount: totalDailyObligation, nextIncurralDate: data.simulation?.date!, frequency: IncurralFrequency.daily}}/>
                </> : null}

                <hr className="text-border border-t w-full mt-2"/>
                <p className="text-xs text-title font-medium leading-none mb-1.5 mt-2">
                    Balance Over Time
                </p>
                <BucketChart bucketId={bucket.bucket.id!} detailed={true}/>
            </div>
            <div className="w-full">
                <Button
                    name="Done"
                    highlight={true}
                    onSubmit={() => setOpen(false)}
                    noAnimation={true}
                    short={true}
                    style="mt-2 w-full"/>
            </div>
        </div>
    )
}
