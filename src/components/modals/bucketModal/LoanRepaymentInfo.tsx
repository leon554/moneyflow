import { useContext, useMemo } from "react"
import { simUtil } from "@/Util/simUtil"
import { dataContext } from "@/providers/DataProvider"
import type { Bucket } from "@/Util/classes/Bucket"
import { AccountType } from "@/Util/types"
import { Util } from "@/Util/util"

interface Props{
    bucket: Bucket
    netflow: number
}
export default function LoanRepaymentInfo({bucket, netflow}: Props) {

    const data = useContext(dataContext)


    const repaymentInfo = useMemo(() => netflow > 0 && bucket.bucket.accountType == AccountType.DeptAccount?
        simUtil.simulateLoanPayoff({
                principal: bucket.bucket.balance,
                annualInterest: bucket.bucket.interest,
                nextCompoundDate: new Date(bucket.bucket.nextIncurralDate),
                compoundFrequency: bucket.bucket.compoundFrequency
            }, 
            bucket.getIncomingPayments(data.incomeSources), 
            bucket.getOutgoingPayments(data.bills),
            data.simulation?.date ?? new Date()
        ) : null, 
    [data.simulation?.date])
    
    
    return (
        <>
            <hr className="text-border border-t w-full mt-2"/>
            <p className="text-xs text-title font-medium leading-none mb-1 mt-2">
                Repayment Time
            </p>
            {!repaymentInfo?.message && repaymentInfo?
                <div className="flex flex-col gap-1.5">
                    <p className="text-xs text-subtext1">
                        Days until paid off: <span className="font-medium text-title">{Util.formatNum(repaymentInfo?.days ?? 0)} days</span>
                    </p>
                    <p className="text-xs text-subtext1">
                        Years until paid off: <span className="font-medium text-title">{Util.formatNum((repaymentInfo?.days ?? 0)/365)} years</span>
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
                </div> :
                <p className="text-xs text-subtext1">
                    {repaymentInfo?.message ?? "It will take more than 50 years to pay off loan"}
                </p>
            }
        </>
    )
}
