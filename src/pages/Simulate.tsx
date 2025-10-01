import { Util } from "@/Util/util"
import Button from "@/components/primitives/Button"
import Chart from "@/components/charts/Chart"
import { useContext, useEffect } from "react"
import { dataContext } from "@/providers/DataProvider"
import { FaPlay } from "react-icons/fa";
import { FaPause } from "react-icons/fa";
import { FaRedoAlt } from "react-icons/fa";
import Select, { type dataFormat } from "@/components/primitives/Select"
import useLocalStorage from "@/hooks/useLocalStorage"
import React from "react"
import TextView from "./TextView"


const items = [{name: "Chart View", id: 0}, {name: "Text View", id: 1}]

function Simulate() {

    const data = useContext(dataContext)
    const [selectedItem, setSelectedItem] = useLocalStorage<dataFormat>("simstate", items[0])
    const {date, running, setRunning, reset, paymentHistory} = data.simulation!
    const {moneyIn, moneyOut} = Util.getMoneyInAndOut(paymentHistory)

    const networth = Math.round(Array.from(data.buckets.values()).reduce((a, c) => a + c.bucket.balance, 0)*100)/100

    useEffect(() => {
        return reset
    }, [])
    
    return (
        <div className="mt-20 m-auto max-w-[1000px] w-[95%] flex flex-col gap-5">
            <div className="flex items-center justify-between">
                <h1 className="text-4xl text-title font-medium">
                    Simulate
                </h1>
               
            </div>
            <hr className="text-border border-t w-full"/>
            <div className="flex flex-col gap-3">
                <div className="flex gap-3 items-center ">
                    <Select
                        selectedItem={selectedItem}
                        setSelectedItem={(id) => setSelectedItem(items[id])}
                        items={items}
                        showIcon={true}
                        center={true}/>
                    <div className="flex gap-5 items-center ">
                        <p className="text-subtext1 font-medium text-sm">
                            <span className="font-normal text-xs text-subtext2">Current Date:</span> {Util.formatDate(date)}
                        </p>
                        <p className="text-subtext1 font-medium text-sm">
                            <span className="font-normal text-xs text-subtext2">Money In:</span> ${Util.formatNum(moneyIn)}
                        </p>
                        <p className="text-subtext1 font-medium text-sm">
                            <span className="font-normal text-xs text-subtext2">Money Out:</span> ${Util.formatNum(moneyOut)}
                        </p>
                        <p className="text-subtext1 font-medium text-sm">
                            <span className="font-normal text-xs text-subtext2">Net Worth:</span> ${Util.formatNum(networth)}
                        </p>
                    </div>
                  
                </div>
                {selectedItem.id == 1 ? 
                <TextView/> :
                <div className="flex flex-col gap-5">
                    <Chart/>
                </div>}
                <div className="flex w-full gap-4">
                    <Button
                        name={`${running ? "Stop Simulations" : " Start Simulation"}`}
                        highlight={true}
                        onSubmit={() => {setRunning(!running)}}
                        style="w-[70%] flex gap-2 items-center"
                        icon={running ? <FaPause className="mt-0.5" size={13}/> : <FaPlay className="mt-0.5" size={13}/>}/>
                    <Button
                        name="Reset Simulation"
                        highlight={false}
                        onSubmit={() => reset()}
                        style="w-[30%] flex gap-2 items-center"
                        icon={<FaRedoAlt className="mt-0.5" size={13}/>}/>
                </div>
            </div>
        </div>
    )
}

export default React.memo(Simulate);