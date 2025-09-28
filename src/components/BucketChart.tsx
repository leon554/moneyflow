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

interface Props{
    bucketId: string
    detailed: boolean
}
export default function BucketChart({bucketId, detailed} : Props) {
    const dc = useContext(dataContext)
    const data = Array.from(dc.buckets.get(bucketId)!.balanceOverTime.entries())

    const rootStyles = getComputedStyle(document.documentElement)

    const title = rootStyles.getPropertyValue('--color-title').trim()
    const subtext2 = rootStyles.getPropertyValue('--color-subtext2').trim()
    const panel = rootStyles.getPropertyValue('--color-panel1').trim() 
    const border = rootStyles.getPropertyValue('--color-chartAxis2').trim()
    const highlight = rootStyles.getPropertyValue('--color-highlight').trim()

    const formatedData = {
        labels: data.map(d => Util.formatDate(new Date(d[0]))),
        datasets: [
            {
                label: "Balance",
                data: data?.map(d => Math.round((d[1] ?? 0)*100)/100) ?? [],
                borderColor: highlight,
                backgroundColor: `#10b98120`,
                borderWidth: 2, 
                tension: 0.1,
                fill: true,
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
        elements: {
            point: {
            radius: 0, 
            },
        },
        scales: {
            x: {
                display: detailed,
                ticks: {
                    display: true, 
                    maxTicksLimit: 10, 
                },
                grid: {
                    display: false, 
                    stepSzie: 20,
                    borderDash: [50, 50],
                    color: border,
                    drawBorder: false
                },
            },
            y: {
                border: {
                    display: true,       
                },
                display: true,  
                ticks: {
                    display: detailed,  
                    maxTicksLimit: 6, 
                },
                grid: {
                    display: true, 
                    stepSzie: 20,
                    borderDash: [50, 50],
                    color: border,
                    drawBorder: false
                },
            },
        },
    }

    return (
        <div className={`bg-panel1 rounded-md outline-1 outline-border w-full ${detailed ? "p-3" :" "} flex flex-col gap-6`}>
            <div className={`${detailed ? "h-[250px]" : "h-33"}`}>
                <Line options={options} data={formatedData as ChartData<"line", number[], string>}/>
            </div>         
        </div>
    )
}
