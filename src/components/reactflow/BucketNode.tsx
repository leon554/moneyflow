
import { useContext } from "react";
import { Handle, Position } from "@xyflow/react";
import type { Node, NodeProps } from "@xyflow/react";
import { dataContext } from "@/providers/DataProvider";
import { Util } from "@/Util/util";
import ProgressBar from "../primitives/ProgressBar";
import { AccountType } from "@/Util/types";
import BucketChart from "../BucketChart";


export type BucketNodeType = Node<{sourceId: string},'incomeSource'>

export function BucketNode(props: NodeProps<BucketNodeType>) {

    const data = useContext(dataContext)
    const bucket = data.buckets.get(props.data.sourceId)
    
    return (
        <div className="text-updater-node">
            {bucket ? 
                <div className="bg-panel1 p-2 min-w-40 max-w-50 outline-1 outline-border rounded-md text-title flex flex-col gap-1">
                    <div className="flex justify-between items-center">
                        <p className="text-sm text-title font-medium">
                            {Util.capFirst(bucket.bucket.name)}
                        </p>
                        <p className="text-sm">
                            {bucket.bucket.accountType == AccountType.CashAccount ? 
                            "💵" : bucket.bucket.accountType == AccountType.SavingsAccount ? 
                            "📈" :
                            "📉"}
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
                    <p className="text-xs text-subtext1">
                        Interest Rate: {bucket.bucket.interest} %
                    </p> : null
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
        </div>
    );
}