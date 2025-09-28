import { useContext, useState } from "react";
import { Handle, Position } from "@xyflow/react";
import type { Node, NodeProps } from "@xyflow/react";
import { dataContext } from "@/providers/DataProvider";
import { Util } from "@/Util/util";
import Modal from "../primitives/Modal";
import BillNodeModal from "../modals/BillNodeModal";
import { MdInfoOutline } from "react-icons/md";


export type BillNodeType = Node<{sourceId: string},'incomeSource'>

export function BillNode(props: NodeProps<BillNodeType>) {

    const data = useContext(dataContext)
    const bill = data.bills.get(props.data.sourceId)

    const [open, setOpen] = useState(false)
    
    return (
        <div className="text-updater-node">
            {bill ? 
                <div className="bg-panel1 p-2 outline-1 outline-border rounded-md text-title flex flex-col gap-1.5">
                    <div className="flex items-center gap-2 justify-between">
                        <p className="text-sm text-title font-medium">
                            {Util.capFirst(bill.billData.name)}
                        </p>
                        <p className="text-sm text-subtext2 hover:cursor-pointer"
                            onClick={() => setOpen(true)}>
                            <MdInfoOutline />
                        </p>
                    </div>
                    <p className="text-xs text-subtext1">
                        ${bill.billData.amount} due {bill.billData.frequency}
                    </p>
                    <p className="text-xs text-subtext1">
                        📅 {Util.formatDate(new Date(bill.billData.nextIncurralDate))} 
                    </p>
                    <Handle type="target" position={Position.Top} />
                </div> :
                <div>
                    <p>
                        Undefined
                    </p>
                </div>
            }
            <Modal open={open} onClose={() => setOpen(false)}>
                <BillNodeModal bill={bill!} setOpen={setOpen}/>
            </Modal>
        </div>
    );
}