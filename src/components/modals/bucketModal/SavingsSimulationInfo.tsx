import { dataContext } from "@/providers/DataProvider"
import type { Bucket } from "@/Util/classes/Bucket"
import { useContext, useMemo } from "react"
import { AccountType, type RecurringPayment } from "@/Util/types"
import { simUtil } from "@/Util/simUtil"
import { Util } from "@/Util/util"


interface Props{
    bucket: Bucket
    netflow: number
    reservePayments: RecurringPayment
}
export default function SavingsSimulationInfo({bucket, netflow, reservePayments}: Props) {

    const data = useContext(dataContext)

    const savingsInfo = useMemo(() => netflow > 0 && bucket.bucket.accountType == AccountType.SavingsAccount?
        simUtil.simulateSavingsTarget({
                currentBalance: bucket.bucket.balance,
                targetBalance: bucket.bucket.targetBalance,
                annualInterest: bucket.bucket.interest,
                nextCompoundDate: new Date(bucket.bucket.nextIncurralDate),
                compoundFrequency: bucket.bucket.compoundFrequency
            }, 
            bucket.getIncomingPayments(data.incomeSources), 
            [...bucket.getOutgoingPayments(data.bills), reservePayments],
            data.simulation?.date ?? new Date()
        ): null, 
    [data.simulation?.date])

    return (
        <>
            <hr className="text-border border-t w-full mt-2"/>
            <p className="text-xs text-title font-medium leading-none mb-1 mt-2">
                Reaching Savings Goal Info
            </p>
            {!savingsInfo?.message && savingsInfo?
                <div className="flex flex-col gap-1.5">
                    <p className="text-xs text-subtext1 flex justify-between">
                        Time to reach goal (days): <span className="font-medium text-title">{Util.formatNum(savingsInfo?.days ?? 0)} days</span>
                    </p>
                    <p className="text-xs text-subtext1 flex justify-between">
                        Time to reach goal (years): <span className="font-medium text-title">{Util.formatNum((savingsInfo?.days ?? 0)/365.25)} years</span>
                    </p>
                    <p className="text-xs text-subtext1 flex justify-between">
                        Estimated completion date: <span className="font-medium text-title">{Util.formatDate(savingsInfo?.payOffDate ?? new Date)}</span>
                    </p>
                    <p className="text-xs text-subtext1 flex justify-between">
                        Projected interest (until goal): <span className="font-medium text-title">{Util.formatNum(savingsInfo?.interestPaid ?? 0, true)}</span>
                    </p>
                    <p className="text-xs text-subtext1 flex justify-between">
                        Projected contributions (until goal): <span className="font-medium text-title">{Util.formatNum(savingsInfo?.amountPaid ?? 0, true)}</span>
                    </p>
                </div> :
                <p className="text-xs text-subtext1">
                    {savingsInfo?.message ?? "Goal will take more than 50 years to reach"}
                </p>
            }
        </>
    )
}
