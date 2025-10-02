import { useState,  useEffect, useContext } from 'react';
import { ReactFlow, type Node, type Edge,  useReactFlow, useNodesState, useEdgesState, Background, BackgroundVariant } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { dataContext } from '@/providers/DataProvider';
import { IncomeSourceNode } from '../reactflow/IncomeSourceNode';
import { BucketNode } from '../reactflow/BucketNode';
import { BillNode } from '../reactflow/BillNode';
import Dagre from '@dagrejs/dagre';
import { useNodesInitialized, useUpdateNodeInternals } from "@xyflow/react";
import { AnimatedEdge } from '../reactflow/AnimateEdge';

const initialNodes: Node[] = [
    { id: 'n1', position: { x: 0, y: 0 }, data: { label: 'Wage' }},
    { id: 'n2', position: { x: 0, y: 100 }, data: { label: 'Savings' } },
];
const initialEdges: Edge[] = [{ id: 'n1-n2', source: 'n1', target: 'n2',  label: '$346',  animated: true,}];

const colors = [
  "#FF3B30", // bright red
  "#FF9500", // orange
  "#FFCC00", // yellow
  "#34C759", // green
  "#00C7BE", // teal
  "#007AFF", // blue
  "#5856D6", // purple
  "#AF52DE", // violet
  "#FF2D55", // pink
  "#FFD60A", // bright yellow-gold
];

const nodeTypes = {
  incomeSourceNode: IncomeSourceNode,
  bucketNode: BucketNode,
  billNode: BillNode
};
const edgeTypes = {
  animatedEdge: AnimatedEdge,
};

const getLayoutedElements = (nodes: Node[], edges: Edge[], options: any) => {
    const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
    g.setGraph({
        rankdir: options.direction,
        ranksep: 170,  // increase vertical spacing
        nodesep: 20    // increase horizontal spacing
    });
    
    edges.forEach((edge: Edge) => g.setEdge(edge.source, edge.target));
    nodes.forEach((node: Node) =>
        g.setNode(node.id, {
        ...node,
        width: node.measured?.width ?? 0,
        height: node.measured?.height ?? 0,
        }),
    );
    
    Dagre.layout(g);
    
    return {
        nodes: nodes.map((node : Node) => {
        const position = g.node(node.id);
        const x = position.x - (node.measured?.width ?? 0) / 2;
        const y = position.y - (node.measured?.height ?? 0) / 2;
    
        return { ...node, position: { x, y } };
        }),
        edges,
    };
};
export default function Chart() {

    const { fitView } = useReactFlow();
    const nodesInitialized = useNodesInitialized();
    const updateNodeInternals = useUpdateNodeInternals();
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [layoutDone, setLayoutDone] = useState(false);

    const data = useContext(dataContext)

    useEffect(() => {
        setLayoutDone(false)
        const incomeSourceArr = Array.from(data.incomeSources.values())
        const bucketArr = Array.from(data.buckets.values())
        const billArr = Array.from(data.bills.values())

        let sourceNodes: Node[] = incomeSourceArr.map((s, i) => {
            return {
                type: "incomeSourceNode",
                id: s.sourceData.id!,
                position: {x: i * 150, y: 0},
                data: {label: s.sourceData.name, sourceId: s.sourceData.id!}
            }
        })
        let bucketNodes: Node[] = bucketArr.map((b, i) => {
            return {
                type: "bucketNode",
                id: b.bucket.id!,
                position: {x: i * 150, y: 200},
                data: {label: b.bucket.name, sourceId: b.bucket.id!}
            }
        })
        let billNodes: Node[] = billArr.map((b, i) => {
            return {
                type: "billNode",
                id: b.billData.id!,
                position: {x: i * 150, y: 400},
                data: {label: b.billData.name, sourceId: b.billData.id!}
            }
        })

        let edges: Edge[] = []

        incomeSourceArr.forEach((i, index) => {
            i.destinationBucketsIds.forEach(bucketId=> {
                edges.push({
                    id: `${i.sourceData.id}-${bucketId}`,
                    source: i.sourceData.id!,
                    target: bucketId!,
                    animated: true,
                    type: "animatedEdge",
                    label: `$${data.buckets.get(bucketId)!.getMoneyAllocated(i.sourceData.incomeAmount, i.sourceData.incomeAmount, i.sourceData.id!, "")}`,
                    style: {stroke: `${colors[index]}`, backgroundColor: "brown"}
                })
            })
        })
        billArr.forEach(b => {
            edges.push({
                id: `${b.billData.sourceBucketId}-${b.billData.id}`,
                source: b.billData.sourceBucketId,
                target: b.billData.id!,
                type: "animatedEdge",
                data: {play: false},
                animated: true,
                label: `$${b.billData.amount}`,
                style: {stroke: "greenyellow"}
            })
        
        })

        setNodes([...sourceNodes, ...bucketNodes, ...billNodes]);
        setEdges([...edges]);
      
    }, [data.hydrated, data.updated])
    
    useEffect(() => {
        if (!nodesInitialized) return;
        if (nodes.length === 0) return;
        if (layoutDone) return; 
        nodes.forEach((n) => updateNodeInternals(n.id));

        requestAnimationFrame(() => {
            const layouted = getLayoutedElements(nodes, edges, { direction: "TB" });
            setNodes(layouted.nodes);
            setEdges(layouted.edges);
            fitView();
            setLayoutDone(true);
        });
    }, [nodesInitialized, nodes, edges, updateNodeInternals, fitView]);

    return (
        <div className="outline-1 outline-border w-full h-[70vh] rounded-md">
            <ReactFlow
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                nodes={nodes}
                edges={edges}
                fitView>
                    <Background color="#636363" variant={BackgroundVariant.Dots} />
            </ReactFlow>
        </div>
    )
}
