import { Link } from "react-router-dom"
import Button from "@/components/primitives/Button"
import { FaArrowRight, FaChartLine, FaShieldAlt, FaSync } from "react-icons/fa"
import { ReactFlow, Background, BackgroundVariant, type Node, type Edge } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { AnimatedEdge } from '@/components/reactflow/AnimateEdge'
import { Handle, Position } from "@xyflow/react"
import { useNodesState } from "@xyflow/react"


type handleType = "source" | "target"
type DemoNodeProps = {
    title: string
    subtitle?: string
    details?: string[] | readonly string[]; 
    handles?: { type: handleType; position: Position }[]
    minWidth?: string
    maxWidth?: string
}

function DemoNode({title, subtitle, details = [], handles = [], minWidth ,maxWidth,}: DemoNodeProps) {
    return (
        <div
            className={`bg-panel1 p-2 outline-1 outline-border rounded-md text-title flex flex-col gap-1`}
            style={{ minWidth, maxWidth }}
        >
        <div className="flex items-center justify-between mb-1 gap-2">
            <p className="text-sm text-title font-medium leading-0">{title}</p>
            <p className="text-sm text-subtext2 hover:cursor-pointer mt-0.5">ℹ️</p>
        </div>
        {subtitle && <p className="text-xs text-subtext2">{subtitle}</p>}
        {details.map((d, i) => (
            <p key={i} className="text-xs text-subtext2">
                {d}
            </p>
        ))}
        {handles.map((h, i) => (
            <Handle key={i} type={h.type} position={h.position} />
        ))}
        </div>
    )
}


const nodeConfig = {
    incomeSource: {
        title: "Salary",
        subtitle: "$5,000 monthly",
        details: ["📅 Next: Jan 1, 2024"],
        handles: [{ type: "source"as handleType, position: Position.Bottom }],
    },
    freelance: {
        title: "Freelance",
        subtitle: "$1,500 monthly",
        details: ["📅 Next: Jan 15, 2024"],
        handles: [{ type: "source"as handleType, position: Position.Bottom }],
    },
    bucket: {
        title: "Savings",
        details: [
        "💵 $2,000    🎯 $10,000",
        "Interest Rate: 2.5%",
        "Interest earned: $50",
        ],
        handles: [
            { type: "target"as handleType, position: Position.Top },
            { type: "source"as handleType, position: Position.Bottom },
        ],
        minWidth: "160px",
        maxWidth: "200px",
    },
    emergency: {
        title: "Emergency Fund",
        details: [
        "💵 $5,000    🎯 $15,000",
        "Interest Rate: 3.2%",
        "Interest earned: $160",
        ],
        handles: [
            { type: "target"as handleType, position: Position.Top },
            { type: "source"as handleType, position: Position.Bottom },
        ],
        minWidth: "160px",
        maxWidth: "200px",
    },
    bill: {
        title: "Rent",
        subtitle: "$1,200 due monthly",
        details: ["📅 Jan 1, 2024"],
        handles: [{ type: "target"as handleType, position: Position.Top }],
    },
    groceries: {
        title: "Groceries",
        subtitle: "$400 due weekly",
        details: ["📅 Jan 3, 2024"],
        handles: [{ type: "target" as handleType, position: Position.Top }],
    },
} 
const nodeTypes = Object.fromEntries(
  Object.entries(nodeConfig).map(([key, cfg]) => [key, () => <DemoNode {...cfg} />,])
)
const demoNodes: Node[] = [
    {
        id: "salary-demo",
        type: "incomeSource",
        position: { x: 100, y: 50 },
        data: {},
        draggable: true,
    },
    {
        id: "freelance-demo",
        type: "freelance",
        position: { x: 300, y: 50 },
        data: {},
        draggable: true,
    },
    {
        id: "savings-demo",
        type: "bucket",
        position: { x: 100, y: 200 },
        data: {},
        draggable: true,
    },
    {
        id: "emergency-demo",
        type: "emergency",
        position: { x: 300, y: 200 },
        data: {},
        draggable: true,
    },
    {
        id: "rent-demo",
        type: "bill",
        position: { x: 100, y: 350 },
        data: {},
        draggable: true,
    },
    {
        id: "groceries-demo",
        type: "groceries",
        position: { x: 300, y: 350 },
        data: {},
        draggable: true,
    },
]
const edges: Edge[] = [
  {
    id: "salary-savings",
    source: "salary-demo",
    target: "savings-demo",
    animated: true,
    type: "animatedEdge",
    style: { stroke: "#34C759", strokeWidth: 3 },
    label: "$2,000",
  },
  {
    id: "freelance-emergency",
    source: "freelance-demo",
    target: "emergency-demo",
    animated: true,
    type: "animatedEdge",
    style: { stroke: "#34C759", strokeWidth: 3 },
    label: "$800",
  },
  {
    id: "savings-rent",
    source: "savings-demo",
    target: "rent-demo",
    animated: true,
    type: "animatedEdge",
    style: { stroke: "#FFCC00", strokeWidth: 3 },
    label: "$1,200",
  },
  {
    id: "freelance-savings",
    source: "freelance-demo",
    target: "savings-demo",
    animated: true,
    type: "animatedEdge",
    style: { stroke: "#FFCC00", strokeWidth: 3 },
    label: "$1,200",
  },
  {
    id: "emergency-groceries",
    source: "emergency-demo",
    target: "groceries-demo",
    animated: true,
    type: "animatedEdge",
    style: { stroke: "#FFCC00", strokeWidth: 3 },
    label: "$400",
  },
]

function DemoFlow() {
  const [nodes, _, onNodesChange] = useNodesState(demoNodes)

  const edgeTypes = {
    animatedEdge: AnimatedEdge,
  }

  return (
    <div className="w-full h-96 rounded-xl border border-border2 overflow-hidden">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        onNodesChange={onNodesChange}
        panOnDrag
        zoomOnScroll
        attributionPosition="bottom-left"
      >
        <Background color="#636363" variant={BackgroundVariant.Dots} />
      </ReactFlow>
    </div>
  )
}


export default function Landing() {
    return (
        <div className="min-h-screen bg-background m-auto">
            <section className="pt-25 pb-20 px-6 sm:px-8 md:px-12 lg:px-4">
                <div className="max-w-7xl mx-auto w-[90%]">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                        <div className="text-center lg:text-left">
                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-title mb-6 leading-tight">
                                Visualize Your
                                <span className="text-highlight block">Money Flow</span>
                            </h1>
                            <p className="text-lg text-subtext1 mb-8 leading-relaxed">
                                Turn your finances into a clear, interactive flow diagram and watch your money move through the system in real time.
                            </p>
                            <div className="flex  sm:flex-row gap-4 justify-center lg:justify-start">
                                <Link to="/home">
                                    <Button
                                        name="Start Building Now"
                                        highlight={true}
                                        onSubmit={() => {}}
                                        icon={<FaArrowRight />}
                                        style="text-lg px-8 py-4 flex gap-2"
                                    />
                                </Link>
                            </div>
                        </div>
                        <DemoFlow />
                    </div>
                </div>
            </section>

            <section className="py-20 px-6 sm:px-8 md:px-12 lg:px-4 bg-panel1">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-20">
                        <h2 className="text-3xl lg:text-5xl font-bold text-title mb-6">Why Visualize Your Money Flow?</h2>
                        <p className="text-lg text-subtext1 max-w-4xl mx-auto leading-relaxed">
                            Traditional budgets are static. MoneyFlow shows you the dynamic movement of your finances.
                        </p>
                    </div>

                    <div className="grid grid-cols-1  md:grid-cols-3 gap-8">
                        <div className="bg-panel2 rounded-md p-6 border border-border2 hover:border-highlight/30 transition-all duration-300">
                            <div className="w-12 h-12 bg-highlight/20 rounded-md flex items-center justify-center mb-4">
                                <FaChartLine className="text-highlight text-xl" />
                            </div>
                            <h3 className="text-xl font-semibold text-title mb-3">Real-Time Simulation</h3>
                            <p className="text-subtext1">
                                Watch your money flow in real-time with animated simulations. 
                                See the impact of changes before you make them.
                            </p>
                        </div>

                        <div className="bg-panel2 rounded-md p-6 border border-border2 hover:border-highlight/30 transition-all duration-300">
                            <div className="w-12 h-12 bg-highlight/20 rounded-md flex items-center justify-center mb-4">
                                <FaShieldAlt className="text-highlight text-xl" />
                            </div>
                            <h3 className="text-xl font-semibold text-title mb-3">Smart Automation</h3>
                            <p className="text-subtext1">
                                Set up automatic money flows between income sources and savings buckets. 
                                Let the system work for you.
                            </p>
                        </div>

                        <div className="bg-panel2 rounded-md p-6 border border-border2 hover:border-highlight/30 transition-all duration-300">
                            <div className="w-12 h-12 bg-highlight/20 rounded-md flex items-center justify-center mb-4">
                                <FaSync className="text-highlight text-xl" />
                            </div>
                            <h3 className="text-xl font-semibold text-title mb-3">Flexible Systems</h3>
                            <p className="text-subtext1">
                                Create multiple financial systems for different goals. 
                                Switch between them instantly to see different scenarios.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-20 px-6 sm:px-8 md:px-12 lg:px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-18">
                        <h2 className="text-3xl lg:text-5xl font-bold text-title mb-4">How It Works</h2>
                        <p className="text-lg  text-subtext1 max-w-4xl mx-auto leading-relaxed">
                            Build your financial system in three simple steps
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center max-w-100 m-auto">
                            <div className="w-16 h-16 bg-highlight/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                <span className="text-2xl font-bold text-highlight">1</span>
                            </div>
                            <h3 className="text-xl font-semibold text-title mb-3">Create Your System</h3>
                            <p className="text-subtext1">
                                Set up income sources, savings buckets, and bills. 
                                Define how money should flow between them.
                            </p>
                        </div>

                        <div className="text-center max-w-100 m-auto">
                            <div className="w-16 h-16 bg-highlight/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                <span className="text-2xl font-bold text-highlight">2</span>
                            </div>
                            <h3 className="text-xl font-semibold text-title mb-3">Visualize the Flow</h3>
                            <p className="text-subtext1">
                                Watch your money flow through an interactive diagram. 
                                See connections and amounts in real-time.
                            </p>
                        </div>

                        <div className="text-center max-w-100 m-auto">
                            <div className="w-16 h-16 bg-highlight/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                <span className="text-2xl font-bold text-highlight">3</span>
                            </div>
                            <h3 className="text-xl font-semibold text-title mb-3">Simulate & Optimize</h3>
                            <p className="text-subtext1">
                                Run simulations to see how your system performs over time. 
                                Optimize your flows for maximum efficiency.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-20 px-6 sm:px-8 md:px-12 lg:px-4 bg-panel1">
                <div className="max-w-5xl mx-auto text-center">
                    <h2 className="text-3xl font-bold text-title mb-6">
                        Ready to Visualize Your Money Flow?
                    </h2>
                    <p className="text-lg text-subtext1 mb-8 max-w-3xl mx-auto leading-relaxed">
                        Start building your financial system today and see your money flow like never before.
                    </p>
                    <div className="flex sm:flex-row gap-4 justify-center">
                        <Link to="/home">
                            <Button
                                name="Get Started Now"
                                highlight={true}
                                onSubmit={() => {}}
                                icon={<FaArrowRight />}
                                style="text-lg px-8 py-4 flex gap-2"
                            />
                        </Link>
                    </div>
                </div>
            </section>
            
            <footer className="py-8 px-6 sm:px-8 md:px-12 lg:px-4 ">
                <div className="max-w-6xl mx-auto text-center">
                    <h3 className="text-lg font-semibold text-title mb-2">
                        Money<span className="text-highlight">Flow</span>
                    </h3>
                    <p className="text-subtext2 text-sm">
                        Visualize your financial system. Understand your money flow.
                    </p>
                </div>
            </footer>
        </div>
    )
}
