import type { IncomeSource } from "@/Util/classes/IncomeSource"
import Button from "../primitives/Button"
import { Util } from "@/Util/util"
import { differenceInDays } from "date-fns"
import { useContext, useMemo } from "react"
import { dataContext } from "@/providers/DataProvider"


interface Props{
    incomeSource: IncomeSource
    setOpen: (open: boolean) => void
}
export default function IncomeSourceNodeModal({incomeSource, setOpen} : Props) {

    const data = useContext(dataContext)
    const allocationData = useMemo(() => incomeSource?.getAllocatedData([], "", data.buckets), [incomeSource])

    return (
        <div className="bg-panel1 outline-1 outline-border rounded-md p-5 flex flex-col gap-1.5 max-w-[400px] w-[90%]"
            onClick={e => e.stopPropagation()}
        >
            <p className=" text-title font-medium leading-none mb-1.5">
                {Util.capFirst(incomeSource!.sourceData.name)}
            </p>
            <hr className="text-border border-t w-full mt-2"/>
            <p className="text-xs text-title font-medium leading-none mb-1 mt-2">
                Overview
            </p>
            <p className="text-xs text-subtext2">
                Pays <span className="font-medium text-title">{Util.formatNum(incomeSource!.sourceData.incomeAmount, true)}</span> {incomeSource!.sourceData.incomeFrequency}
            </p>
            <p className="text-xs text-subtext2">
                Next pay day in: {differenceInDays( new Date(incomeSource!.sourceData.nextIncurralDate), data.simulation!.date)+1} days ({Util.formatDate(new Date(incomeSource!.sourceData.nextIncurralDate))})
            </p>
            {allocationData ? 
            <p className="text-xs text-subtext2">
                {Math.round(allocationData.allocatedAmount/(allocationData.allocatedAmount + allocationData.unAllocatedAmount)*100)/100*100}% of income allocated
            </p> : null}
            <p className="text-xs text-subtext2">
                {Util.capFirst(incomeSource!.sourceData.name)} has paid ${Util.formatNum(incomeSource!.totalPaid)} since {Util.formatDate(new Date())}
            </p>
            <hr className="text-border border-t w-full mt-2"/>
            <p className="text-xs text-title font-medium leading-none mb-1 mt-2">
                Pay Rate
            </p>
            <div className="grid grid-cols-2 gap-1.5">
                <p className="text-xs text-subtext2">
                    Daily:  <span className="font-medium text-title">{Util.formatNum(Util.getPayPerDay(incomeSource!.sourceData.incomeAmount, incomeSource!.sourceData.incomeFrequency), true)}</span> 
                </p>
                <p className="text-xs text-subtext2">
                    Weekly:  <span className="font-medium text-title">{Util.formatNum(Util.getPayPerDay(incomeSource!.sourceData.incomeAmount, incomeSource!.sourceData.incomeFrequency)*7, true)}</span> 
                </p>
                <p className="text-xs text-subtext2">
                    Monthly:  <span className="font-medium text-title">{Util.formatNum(Util.getPayPerDay(incomeSource!.sourceData.incomeAmount, incomeSource!.sourceData.incomeFrequency)*30, true)} </span>
                </p>
                <p className="text-xs text-subtext2">
                    Yearly:  <span className="font-medium text-title">{Util.formatNum(Util.getPayPerDay(incomeSource!.sourceData.incomeAmount, incomeSource!.sourceData.incomeFrequency)*365, true)} </span>
                </p>
            </div>
            <hr className="text-border border-t w-full mt-2"/>
            <p className="text-xs text-title font-medium leading-none mb-1 mt-2">
                Attached Buckets
            </p>
            {allocationData && allocationData.allocationDistribution.map(d => {
                return(
                    <p className="text-xs text-subtext2">
                    Pays <span className="font-medium text-title">{Util.formatNum(d.allocated, true)}</span> ({Math.round((d.allocated/(allocationData.allocatedAmount + allocationData.unAllocatedAmount)*100)/100*100)}%) to {d.name}
                    </p>
                )
            })}              
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
