import { Util } from "@/Util/util"
import Button from "@/components/primitives/Button"
import useSimulation from "@/hooks/useSimulation"
import Chart from "@/components/Chart"
import { useEffect } from "react"


export default function Simulate() {

    const {date, running, setRunning, reset} = useSimulation()

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
                <p className="text-subtext1 font-medium text-sm">
                    {Util.formatDate(date)}
                </p>
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
