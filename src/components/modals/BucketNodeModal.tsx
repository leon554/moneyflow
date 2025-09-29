import type { Bucket } from "@/Util/classes/Bucket"
import Button from "../primitives/Button"
import { AccountType } from "@/Util/types"
import { Util } from "@/Util/util"
import { useContext, useMemo } from "react"
import { dataContext } from "@/providers/DataProvider"
import BucketChart from "../BucketChart"

interface Props{
    bucket: Bucket
    setOpen: (open: boolean) => void
}
export default function BucketNodeModal({bucket, setOpen}: Props) {

    const data = useContext(dataContext)

    const inflow = bucket?.getDailyInFlow(data.incomeSources)
    const outflow = bucket?.getDailyOutFlow(data.bills)
    const netflow = inflow - outflow

    const repaymentInfo = useMemo(() => bucket.bucket.accountType == AccountType.DeptAccount?
        Util.simulateLoanPayoff({
                principal: Math.abs(bucket.bucket.balance),
                annualInterest: bucket.bucket.interest,
                nextCompoundDate: new Date(bucket.bucket.nextIncurralDate),
                compoundFrequency: bucket.bucket.compoundFrequency
            }, 
            bucket.getPayments(data.incomeSources), 
            data.simulation?.date ?? new Date()
        ) : null, 
    [data.simulation?.date])
    return (
       <div className="bg-panel1 outline-1 outline-border rounded-md p-5 flex flex-col gap-1.5 max-w-[400px] w-[90%]"
            onClick={e => e.stopPropagation()}
        >
            <p className="text-title font-medium leading-none mb-1.5">
                {Util.capFirst(bucket!.bucket.name)}
            </p>
            <hr className="text-border border-t w-full mt-2"/>
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
                    Avg daily in flow: <span className="font-medium text-green-300">${Util.formatNum(inflow)}</span>
                </p>
                <p className="text-xs text-subtext1">
                    Avg daily out flow: <span className="font-medium text-red-300">${Util.formatNum(outflow)}</span>
                </p>
                <p className="text-xs text-subtext1">
                    Avg daily net flow: <span className="font-medium text-title">{netflow < 0 ? "-$" : "$"}{Util.formatNum(netflow < 0 ?  netflow * -1 : netflow)}</span>
                </p>
                <p className="text-xs text-subtext1">
                    Avg daily surplus: <span className="font-medium text-title">{Math.round(((netflow)/inflow)*100*100)/100}%</span>
                </p>
            </div>
            {bucket!.bucket.accountType == AccountType.DeptAccount ? 
            <>
                <hr className="text-border border-t w-full mt-2"/>
                <p className="text-xs text-title font-medium leading-none mb-1 mt-2">
                    Repayment Time
                </p>
                <div className="flex flex-col gap-1.5">
                    <p className="text-xs text-subtext1">
                        Days until paid off: <span className="font-medium text-title">{Util.formatNum(repaymentInfo?.days ?? 0)} days</span>
                    </p>
                    <p className="text-xs text-subtext1">
                        Date until paid off: <span className="font-medium text-title">{Util.formatDate(repaymentInfo?.payOffDate ?? new Date)}</span>
                    </p>
                    <p className="text-xs text-subtext1">
                        Interest to be paid for remaining loan: <span className="font-medium text-title">{Util.formatNum(repaymentInfo?.interestPaid ?? 0, true)}</span>
                    </p>
                    <p className="text-xs text-subtext1">
                        Amount to pay off remaining loan: <span className="font-medium text-title">{Util.formatNum(repaymentInfo?.amountPaid ?? 0, true)}</span>
                    </p>
                </div>
            </> : null}
            <hr className="text-border border-t w-full mt-2"/>
            <p className="text-xs text-title font-medium leading-none mb-1.5 mt-2">
                Balance Over Time
            </p>
            <BucketChart bucketId={bucket.bucket.id!} detailed={true}/>
            <Button
                name="Done"
                highlight={true}
                short={true}
                onSubmit={() => setOpen(false)}
                noAnimation={true}
                style="mt-2"/>
        </div>
    )
}
