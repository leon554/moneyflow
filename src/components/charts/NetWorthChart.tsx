import {Line} from "react-chartjs-2"
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, type ChartData, Filler} from "chart.js"
import { dataContext } from "@/providers/DataProvider"
import { useContext } from "react"
import { Util } from "@/Util/util"

ChartJS.register(
    CategoryScale, 
    LinearScale, 
    PointElement, 
    LineElement, 
    Title, 
    Tooltip,  
    Filler
)
export default function NetWorthChart() {
    const dc = useContext(dataContext)

    const data = getData()

    function getData(){
        const d = new Map<string, number>()
        Array.from(dc.buckets.values()).forEach(b =>{
            Array.from(b.balanceOverTime.entries()).forEach(e => {
                e[0] = Util.formatDate(new Date(e[0])).slice(0, 5)
                if(d.has(e[0])){
                    const amount = d.get(e[0])!
                    d.set(e[0], amount + e[1])
                }else{
                    d.set(e[0], e[1])
                }
            })
        })
        return d
    }

    const rootStyles = getComputedStyle(document.documentElement)

    const title = rootStyles.getPropertyValue('--color-title').trim()
    const subtext2 = rootStyles.getPropertyValue('--color-subtext2').trim()
    const panel = rootStyles.getPropertyValue('--color-panel1').trim() 
    const border = rootStyles.getPropertyValue('--color-chartAxis2').trim()
    const highlight = rootStyles.getPropertyValue('--color-highlight').trim()

    const formatedData = {
        labels: Array.from(data.keys()).slice(-365),
        datasets: [
            {
                label: "Balance",
                data: Array.from(data.values()).slice(-365),
                borderColor: highlight,
                backgroundColor: `#10b98120`,
                borderWidth: 2, 
                tension: 0.1,
                fill: true,
                pointRadius: 0,
                pointHoverRadius: 3,
                stepped: false,
            },
        ]
    }
    
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        devicePixelRatio: window.devicePixelRatio,
        plugins: {
            legend: {
                display: false, 
            },
            tooltip: {
                mode: "index" as const,         
                intersect: false,   
                backgroundColor: panel,
                titleColor: title,   
                bodyColor: subtext2,     
                borderColor: border,    
                borderWidth: 1,
                padding: 10,
                titleFont: {
                    family: "'Inter', sans-serif",
                    weight: 500,
                    size: 12,
                },
                bodyFont: {
                    size: 11,
                },
                cornerRadius: 6,            
                displayColors: false   
            },
        },

        scales: {
            x: {
                offset: false,
                display: true,
                ticks: {
                    display: true,
                    maxTicksLimit: 6,
                },
                grid: {
                    color: border,
                    drawTicks: true,
                },
            },
            y: {
                display: true,  
                ticks: {
                    display: true,  
                    maxTicksLimit: 4, 
                    callback: (value: string) => Util.formatNum(Number(value), true)
                },
                grid: {
                    drawTicks: true,
                    color: border,
                    tickBorderDashOffset: 10
                },
            },
        },
    }

    return (
        <div className={`bg-panel1 rounded-md border-1 border-border p-3 flex flex-col gap-6`}>
            <div className={` h-[250px]`}>
                <Line options={options as any} data={formatedData as ChartData<"line", number[], string>}/>
            </div>         
        </div>
    )
}
