
import { useContext, useMemo, useState} from "react";
import { Handle, Position } from "@xyflow/react";
import type { Node, NodeProps } from "@xyflow/react";
import { dataContext } from "@/providers/DataProvider";
import { Util } from "@/Util/util";
import { MdInfoOutline } from "react-icons/md";
import Modal from "../primitives/Modal";
import Button from "../primitives/Button";
import { differenceInDays } from "date-fns";

export type IncomeSourceNode = Node<{sourceId: string},'incomeSource'>

export function IncomeSourceNode(props: NodeProps<IncomeSourceNode>) {

    const data = useContext(dataContext)
    const incomeSource = useMemo(() => data.incomeSources.get(props.data.sourceId), [props.data.sourceId]) 
    const allocationData = useMemo(() => incomeSource?.getAllocatedData([], "", data.buckets), [incomeSource])

    const [open, setOpen] = useState(false)
      
    return (
        <>
            <div className="text-updater-node">
                {incomeSource ? 
                    <div className="bg-panel1 p-2 outline-1 outline-border rounded-md text-title flex flex-col gap-1">
                        <div className="flex items-center justify-between mb-1 gap-2">
                            <p className="text-sm text-title font-medium leading-0">
                                {Util.capFirst(incomeSource.sourceData.name)}
                            </p>
                            <p className="text-sm text-subtext2 hover:cursor-pointer mt-0.5"
                                onClick={() => setOpen(true)}>
                                <MdInfoOutline />
                            </p>
                        </div>
                        <p className="text-xs text-subtext2">
                            {Util.formatNum(incomeSource.sourceData.incomeAmount, true)} {incomeSource.sourceData.incomeFrequency}
                        </p>
                        <p className="text-xs text-subtext2">
                            📅 {Util.formatDate(new Date(incomeSource.sourceData.nextIncurralDate))}
                        </p>
                        <Handle type="source" position={Position.Bottom} />
                    </div> :
                    <div>
                        <p>
                            Undefined
                        </p>
                    </div>
                }
            </div>
            <Modal open={open} onClose={() => setOpen(false)}>
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
                    <p className="text-xs text-subtext2">
                        Weekly:  <span className="font-medium text-title">${Util.formatNum(Util.getPayPerDay(incomeSource!.sourceData.incomeAmount, incomeSource!.sourceData.incomeFrequency)*7)}</span> 
                    </p>
                    <p className="text-xs text-subtext2">
                        Monthly:  <span className="font-medium text-title">${Util.formatNum(Util.getPayPerDay(incomeSource!.sourceData.incomeAmount, incomeSource!.sourceData.incomeFrequency)*30)} </span>
                    </p>
                    <p className="text-xs text-subtext2">
                        Yearly:  <span className="font-medium text-title">${Util.formatNum(Util.getPayPerDay(incomeSource!.sourceData.incomeAmount, incomeSource!.sourceData.incomeFrequency)*365)} </span>
                    </p>
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
            </Modal>
        </>
    );
}