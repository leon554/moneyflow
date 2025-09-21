
import { useContext } from "react";
import { Handle, Position } from "@xyflow/react";
import type { Node, NodeProps } from "@xyflow/react";
import { dataContext } from "@/providers/DataProvider";
import { Util } from "@/Util/util";


export type IncomeSourceNode = Node<{sourceName: string},'incomeSource'>

export function IncomeSourceNode(props: NodeProps<IncomeSourceNode>) {

    const data = useContext(dataContext)
    const incomeSource = data.incomeSources.get(props.data.sourceName)
    
    return (
        <div className="text-updater-node">
            {incomeSource ? 
                <div className="bg-panel1 p-2 outline-1 outline-border rounded-md text-title flex flex-col gap-1">
                    <p className="text-sm text-title font-medium">
                        {Util.capFirst(incomeSource.sourceData.name)}
                    </p>
                    <p className="text-xs text-subtext2">
                        ${incomeSource.sourceData.incomeAmount} {incomeSource.sourceData.incomeFrequency}
                    </p>
                    <p className="text-xs text-subtext2">
                        Next {Util.formatDate(new Date(incomeSource.sourceData.nextIncurralDate))}
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
    );
}