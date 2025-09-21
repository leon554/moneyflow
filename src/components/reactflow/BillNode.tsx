import { useContext } from "react";
import { Handle, Position } from "@xyflow/react";
import type { Node, NodeProps } from "@xyflow/react";
import { dataContext } from "@/providers/DataProvider";
import { Util } from "@/Util/util";


export type BillNodeType = Node<{sourceName: string},'incomeSource'>

export function BillNode(props: NodeProps<BillNodeType>) {

    const data = useContext(dataContext)
    const bill = data.bills.get(props.data.sourceName)
    
    return (
        <div className="text-updater-node">
            {bill ? 
                <div className="bg-panel1 p-2 outline-1 outline-border rounded-md text-title flex flex-col gap-1.5">
                    <p className="text-sm text-title font-medium">
                        {Util.capFirst(bill.billData.name)}
                    </p>
                    <p className="text-xs text-subtext1">
                        ${bill.billData.amount} due {bill.billData.frequency}
                    </p>
                    <p className="text-xs text-subtext1">
                        📅 {Util.formatDate(new Date(bill.billData.nextIncurralDate))} 
                    </p>
                    <p className="text-xs text-subtext1">
                        Total Paid: ${bill.billData.balance}
                    </p>
                    <Handle type="target" position={Position.Top} />
                </div> :
                <div>
                    <p>
                        Undefined
                    </p>
                </div>
            }
        </div>
    );
}