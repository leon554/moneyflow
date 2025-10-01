import type { Bucket } from "@/Util/classes/Bucket"
import Button from "../../primitives/Button"
import { AccountType } from "@/Util/types"
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

    const inflow = bucket?.getDailyInFlow(data.incomeSources)
    const outflow = bucket?.getDailyOutFlow(data.bills)
    const netflow = inflow - outflow

    return (
       <div className="bg-panel1 outline-1 outline-border rounded-md p-5 flex flex-col gap-1.5 max-w-[400px] w-[90%]"
            onClick={e => e.stopPropagation()}
        >
            <p className="text-title font-medium leading-none mb-1.5">
                {Util.capFirst(bucket!.bucket.name)}
            </p>
            <hr className="text-border border-t w-full mt-2"/>
            <div className="flex flex-col gap-1.5  max-h-[440px] overflow-y-scroll no-scrollbar pb-[1px] mb-2">

                <p className="text-xs text-title font-medium leading-none mb-1 mt-2">
                    Overview
                </p>
                <div className="grid grid-cols-2 gap-1.5">
                    <p className="text-xs text-subtext1">
                        Balance: <span className="font-medium text-title">{Util.formatNum(bucket!.bucket.balance, true)}</span> 
                    </p>
                    <p className="text-xs text-subtext1">
                        Goal: <span className="font-medium text-title">{Util.formatNum(bucket.bucket.targetBalance, true)}</span> 
                    </p>
                    {bucket!.bucket.accountType != AccountType.CashAccount ? 
                    <>
                        <p className="text-xs text-subtext1">
                            Annual interest: {" "}
                            <span className="font-medium text-title">{bucket?.bucket.interest}%</span>
                        </p>
                        <p className="text-xs text-subtext1">
                            Interest {bucket!.bucket.accountType == AccountType.SavingsAccount ? "earned: " : "payed: "}  
                            <span className="font-medium text-title">{Util.formatNum(Math.abs(bucket!.interestAmount), true)}</span> 
                        </p> 
                    </> : null}
                </div>
                <hr className="text-border border-t w-full mt-2"/>
                <p className="text-xs text-title font-medium leading-none mb-1 mt-2">
                    Incoming & Outgoing
                </p>
                <div className="grid grid-cols-2 gap-1.5">
                    <p className="text-xs text-subtext1">
                        Total in flow: <span className="font-medium text-green-300">{Util.formatNum(bucket.flowData.in, true)}</span>
                    </p>
                    <p className="text-xs text-subtext1">
                        Total out flow: <span className="font-medium text-red-300">{Util.formatNum(bucket.flowData.out, true)}</span>
                    </p>
                    <p className="text-xs text-subtext1">
                        Avg daily in flow: <span className="font-medium text-green-300">{Util.formatNum(inflow, true)}</span>
                    </p>
                    <p className="text-xs text-subtext1">
                        Avg daily out flow: <span className="font-medium text-red-300">{Util.formatNum(outflow, true)}</span>
                    </p>
                    <p className="text-xs text-subtext1">
                        Avg daily net flow: <span className="font-medium text-title">{Util.formatNum(netflow < 0 ?  netflow * -1 : netflow, true)}</span>
                    </p>
                    <p className="text-xs text-subtext1">
                        Avg daily surplus: <span className="font-medium text-title">{Math.round(((netflow)/inflow)*100*100)/100}%</span>
                    </p>
                </div>
                
                {bucket!.bucket.accountType == AccountType.DeptAccount ? 
                <>
                    <LoanRepaymentInfo bucket={bucket}/>
                </> : null}
                {bucket!.bucket.accountType == AccountType.SavingsAccount ? 
                <>
                   <SavingsSimulationInfo bucket={bucket}/>
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
