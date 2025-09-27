
import { useContext, useMemo, useState } from "react";
import { Handle, Position } from "@xyflow/react";
import type { Node, NodeProps } from "@xyflow/react";
import { dataContext } from "@/providers/DataProvider";
import { Util } from "@/Util/util";
import ProgressBar from "../primitives/ProgressBar";
import { AccountType } from "@/Util/types";
import BucketChart from "../BucketChart";
import { MdInfoOutline } from "react-icons/md";
import Button from "../primitives/Button";
import Modal from "../primitives/Modal";


export type BucketNodeType = Node<{sourceId: string},'incomeSource'>

export function BucketNode(props: NodeProps<BucketNodeType>) {

    const data = useContext(dataContext) 
    const bucket = useMemo(() => data.buckets.get(props.data.sourceId), [props.data.sourceId])
    const [open, setOpen] = useState(false)

    return (
        <div className="text-updater-node">
            {bucket ? 
                <div className="bg-panel1 p-2 min-w-40 max-w-50 outline-1 outline-border rounded-md text-title flex flex-col gap-1">
                    <div className="flex justify-between items-center">
                        <p className="text-sm text-title font-medium">
                            {Util.capFirst(bucket.bucket.name)}
                        </p>
                        <p className="text-sm text-subtext2 hover:cursor-pointer mt-0.5"
                            onClick={() => setOpen(true)}>
                            <MdInfoOutline />
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <p className="text-xs text-subtext1">
                            💵 ${Math.round(bucket.bucket.balance*100)/100}
                        </p>
                        {bucket.bucket.targetBalance == 0 ? null : 
                        <p className="text-xs text-subtext1">
                            🎯 ${bucket.bucket.targetBalance}
                        </p>
                        }
                    </div>
                    {bucket.bucket.accountType != AccountType.CashAccount ? 
                        <>
                            <p className="text-xs text-subtext1">
                                Interest Rate: {bucket.bucket.interest} %
                            </p>
                             <p className="text-xs text-subtext1">
                                Interest {bucket.bucket.accountType == AccountType.SavingsAccount ? "earned: " : "payed: "}  
                                ${Math.round(bucket.interestAmount*100)/100}
                            </p>
                        </>
                        : null
                    }
                    {bucket.bucket.targetBalance == 0 ? null :
                        <ProgressBar value={bucket.bucket.balance/bucket.bucket.targetBalance}/>
                    }
                    <div className="flex flex-col gap-1.5">
                        <p className="text-xs text-subtext1">
                            Balance Over Time
                        </p>
                        <BucketChart bucketId={bucket.bucket.id!}/>
                    </div>
                    <Handle type="target" position={Position.Top} />
                    <Handle type="source" position={Position.Bottom} />
                </div> :
                <div>
                    <p>
                        Undefined
                    </p>
                </div>
            }
            <Modal open={open} onClose={() => setOpen(false)}>
                <div className="bg-panel1 outline-1 outline-border rounded-md p-5 flex flex-col gap-1 max-w-[400px] w-[90%]"
                    onClick={e => e.stopPropagation()}
                >
                    <p className="text-sm text-title font-medium leading-none mb-1.5">
                        {Util.capFirst(bucket!.bucket.name)}
                    </p>
                            
                    <Button
                        name="Done"
                        highlight={true}
                        short={true}
                        onSubmit={() => setOpen(false)}
                        noAnimation={true}
                        style="mt-2"/>
                </div>
            </Modal>
        </div>
    );
}