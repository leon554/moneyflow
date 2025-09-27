import { Util } from "@/Util/util"
import Button from "@/components/primitives/Button"
import useSimulation from "@/hooks/useSimulation"
import Chart from "@/components/Chart"
import { useContext, useEffect } from "react"
import { dataContext } from "@/providers/DataProvider"


export default function Simulate() {

    const {date, running, setRunning, reset, paymentHistory} = useSimulation()
    const {moneyIn, moneyOut} = Util.getMoneyInAndOut(paymentHistory)

    const data = useContext(dataContext)
    const networth = Math.round(Array.from(data.buckets.values()).reduce((a, c) => a + c.bucket.balance, 0)*100)/100

    useEffect(() => {
        return reset
    }, [])
    
    return (
        <div className="mt-20 m-auto max-w-[1000px] w-[95%] flex flex-col gap-5">
            <h1 className="text-2xl text-title font-medium">
                Simulate
            </h1>
            <hr className="text-border border-t w-full"/>
            <div className="flex flex-col gap-1.5">
                <div className="flex gap-5">
                    <p className="text-subtext1 font-medium text-sm">
                        <span className="font-normal text-xs text-subtext2">Current Date:</span> {Util.formatDate(date)}
                    </p>
                    <p className="text-subtext1 font-medium text-sm">
                        <span className="font-normal text-xs text-subtext2">Money In:</span> ${moneyIn}
                    </p>
                    <p className="text-subtext1 font-medium text-sm">
                        <span className="font-normal text-xs text-subtext2">Money Out:</span> ${moneyOut}
                    </p>
                    <p className="text-subtext1 font-medium text-sm">
                        <span className="font-normal text-xs text-subtext2">Net Worth:</span> ${networth}
                    </p>
                </div>
                <Chart/>
            </div>
           
            <div className="flex w-full gap-4">
                <Button
                    name={`${running ? "Stop Simulations" : " Start Simulation"}`}
                    highlight={true}
                    onSubmit={() => {setRunning(!running)}}
                    style="w-[70%]"/>
                <Button
                    name="Reset Simulation"
                    highlight={false}
                    onSubmit={reset}
                    style="w-[30%]"/>
            </div>
        </div>
    )
}
