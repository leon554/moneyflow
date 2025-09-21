
import { useContext } from "react";
import { Handle, Position } from "@xyflow/react";
import type { Node, NodeProps } from "@xyflow/react";
import { dataContext } from "@/providers/DataProvider";
import { Util } from "@/Util/util";


export type BucketNodeType = Node<{sourceName: string},'incomeSource'>

export function BucketNode(props: NodeProps<BucketNodeType>) {

    const data = useContext(dataContext)
    const bucket = data.buckets.get(props.data.sourceName)
    
    return (
        <div className="text-updater-node">
            {bucket ? 
                <div className="bg-panel1 p-2 outline-1 outline-border rounded-md text-title flex flex-col gap-1">
                    <p className="text-sm text-title font-medium">
                        {Util.capFirst(bucket.bucket.name)}
                    </p>
                    <p className="text-xs text-subtext1">
                        ${bucket.bucket.balance}
                    </p>
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