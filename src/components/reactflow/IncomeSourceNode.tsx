
import { useContext, useMemo, useState} from "react";
import { Handle, Position } from "@xyflow/react";
import type { Node, NodeProps } from "@xyflow/react";
import { dataContext } from "@/providers/DataProvider";
import { Util } from "@/Util/util";
import { MdInfoOutline } from "react-icons/md";
import Modal from "../primitives/Modal";
import IncomeSourceNodeModal from "../modals/IncomeSourceNodeModal";

export type IncomeSourceNode = Node<{sourceId: string},'incomeSource'>

export function IncomeSourceNode(props: NodeProps<IncomeSourceNode>) {

    const data = useContext(dataContext)
    const incomeSource = useMemo(() => data.incomeSources.get(props.data.sourceId), [props.data.sourceId]) 

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
                {open ? <IncomeSourceNodeModal incomeSource={incomeSource!} setOpen={setOpen}/> : null}
            </Modal>
        </>
    );
}