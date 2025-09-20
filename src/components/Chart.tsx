import { useState, useCallback, useEffect, useContext } from 'react';
import { ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge, Background, type Node, type Edge, type OnNodesChange, type OnEdgesChange, type OnConnect } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { dataContext } from '@/providers/DataProvider';

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
export default function Chart() {

    const [nodes, setNodes] = useState(initialNodes);
    const [edges, setEdges] = useState(initialEdges);

    const data = useContext(dataContext)

    useEffect(() => {
        const incomeSourceArr = Array.from(data.incomeSources.values())
        const bucketArr = Array.from(data.buckets.values())
        const billArr = Array.from(data.bills.values())
        let sourceNodes: Node[] = incomeSourceArr.map((s, i) => {
            return {
                id: s.sourceData.name,
                position: {x: i * 150, y: 0},
                data: {label: s.sourceData.name}
            }
        })
        let bucketNodes: Node[] = bucketArr.map((b, i) => {
            return {
                id: b.bucket.name,
                position: {x: i * 150, y: 100},
                data: {label: b.bucket.name}
            }
        })
        let billNodes: Node[] = billArr.map((b, i) => {
            return {
                id: b.billData.name,
                position: {x: i * 150, y: 200},
                data: {label: b.billData.name}
            }
        })

        let edges: Edge[] = []

        incomeSourceArr.forEach((i, index) => {
            i.destinationBuckets.forEach(b=> {
                edges.push({
                    id: `${i.sourceData.name}-${b.bucket.name}`,
                    source: i.sourceData.name,
                    target: b.bucket.name,
                    animated: true,
                    label: `$${b.getMoneyAllocated(i.sourceData.incomeAmount, i.sourceData.incomeAmount, i.sourceData.name)}`,
                    style: {stroke: `${colors[index]}`, backgroundColor: "brown"}
                })
            })
        })
        billArr.forEach(b => {
            edges.push({
                id: `${b.billData.sourceBucketName}-${b.billData.name}`,
                source: b.billData.sourceBucketName,
                target: b.billData.name,
                animated: true,
                label: `$${b.billData.amount}`,
                style: {stroke: "green", backgroundColor: "brown"}
            })
        
        })
        setEdges([...edges])
        setNodes([...sourceNodes, ...bucketNodes, ...billNodes])
        
    }, [data.incomeSources, data.buckets])
    
    const onNodesChange: OnNodesChange = useCallback(
        (changes) => setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
        [],
    );
    const onEdgesChange: OnEdgesChange = useCallback(
        (changes) => setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
        [],
    );
    const onConnect: OnConnect = useCallback(
        (params) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
        [],
    );
    return (
        <div className="bg-panel2 w-full h-[50vh] mb-20">
            <ReactFlow
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                nodes={nodes}
                edges={edges}>

            </ReactFlow>
        </div>
    )
}
