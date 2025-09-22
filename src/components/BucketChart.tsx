import {Line} from "react-chartjs-2"
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, type ChartData} from "chart.js"
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
)

interface Props{
    bucketId: string
}
export default function BucketChart({bucketId} : Props) {
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
                label: "Data",
                data: data?.map(d => d[1] ?? 0) ?? [],
                borderColor: highlight,
                borderWidth: 2, 
                tension: 0.1,
            },
        ]
    }
    const options = {
        responsive: true,
        maintainAspectRatio: false,
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
                display: false,
                ticks: {
                    display: true, 
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
                    display: false,       
                },
                display: true,  
                ticks: {
                    display: false,  
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
        <div className="bg-panel1 rounded-md outline-1 outline-border w-full flex flex-col gap-6 ">
            <div className="h-33 bg">
                <Line options={options} data={formatedData as ChartData<"line", number[], string>}/>
            </div>         
        </div>
    )
}
