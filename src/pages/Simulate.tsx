import { Util } from "@/Util/util"
import Button from "@/components/primitives/Button"
import Chart from "@/components/charts/Chart"
import { useContext, useEffect, useState} from "react"
import { dataContext } from "@/providers/DataProvider"
import { FaPlay } from "react-icons/fa";
import { FaPause } from "react-icons/fa";
import { FaRedoAlt } from "react-icons/fa";
import Select, { type dataFormat } from "@/components/primitives/Select"
import useLocalStorage from "@/hooks/useLocalStorage"
import TextView from "./TextView"


const items = [{name: "Chart View", id: 0}, {name: "Text View", id: 1}]

export default function Simulate() {

    const data = useContext(dataContext)

    const systemItems = data.systemData.map((d, i) => ({id: i, name: d.name, data: d.id})) as dataFormat[]
    const [selectedSystem, setSelectedSystem] = useState<null | dataFormat>(null)
    const [chartKey, setChartKey] = useState(0) 

    const [selectedItem, setSelectedItem] = useLocalStorage<dataFormat>("simstate", items[0])
    const {date, running, setRunning, reset, paymentHistory} = data.simulation!
    const {moneyIn, moneyOut} = Util.getMoneyInAndOut(paymentHistory)
    const [hide, setHide] = useState(false)

    const networth = Math.round(Array.from(data.buckets.values()).reduce((a, c) => a + c.bucket.balance, 0)*100)/100
    console.log(hide)
    useEffect(() => {
        return () => reset()
    }, [data.selectedSystem])

    useEffect(() => {
        if(!selectedSystem) return
        console.log("System selected:", selectedSystem)
        setHide(true)
        const id = setTimeout(() => setHide(false), 100)
        data.setSelectedSystem(_ => selectedSystem.data!)
        setChartKey(prev => prev + 1)
        return () => {clearTimeout(id); setHide(false)}
    }, [selectedSystem])

    useEffect(() => {
        if(!data.selectedSystem) return
        console.log("ran 11")
        setSelectedSystem(systemItems.find(i => i.data == data.selectedSystem)!)
    }, [data.selectedSystem])
    
    return (
        <div className="mt-16 m-auto max-w-[1000px] w-[95%] flex flex-col gap-5">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl text-title font-medium">
                    Simulate
                </h1>
               
            </div>
            <hr className="text-border border-t w-full"/>
            <div className="flex flex-col gap-3">
                <div className="flex lg:flex-row flex-col gap-3 items-center ">
                    <div className="grid grid-cols-2 lg:w-[30%] w-full gap-3">
                        <Select
                            items={systemItems}
                            selectedItem={selectedSystem}
                            setSelectedItem={(id) => setSelectedSystem(systemItems[id])}
                            showIcon={true}
                            defaultText="Select System"
                        />
                        <Select
                            selectedItem={selectedItem}
                            setSelectedItem={(id) => setSelectedItem(items[id])}
                            items={items}
                            showIcon={true}
                            center={false}/>
                    </div>
                    <div className="grid grid-cols-4 w-full gap-3 items-center">
                        <p className="text-subtext1 font-medium text-xs bg-panel2 flex-1 h-7 p-3 rounded-md outline-1 outline-border flex gap-1.5 items-center justify-between">
                            <span className="font-normal text-xs text-subtext2 overflow-ellipsis truncate">Current Date</span> {Util.formatDate(date)}
                        </p>
                        <p className="text-subtext1 font-medium text-xs bg-panel2 flex-1 h-7 p-3 rounded-md outline-1 outline-border flex gap-1.5 items-center justify-between">
                            <span className="font-normal text-xs text-subtext2 overflow-ellipsis truncate">Money In</span> ${Util.formatNum(moneyIn)}
                        </p>
                        <p className="text-subtext1 font-medium text-xs bg-panel2 flex-1 h-7 p-3 rounded-md outline-1 outline-border flex gap-1.5 items-center justify-between">
                            <span className="font-normal text-xs text-subtext2 overflow-ellipsis truncate">Money Out</span> ${Util.formatNum(moneyOut)}
                        </p>
                        <p className="text-subtext1 font-medium text-xs bg-panel2 flex-1 h-7 p-3 rounded-md outline-1 outline-border flex gap-1.5 items-center justify-between">
                            <span className="font-normal text-xs text-subtext2 overflow-ellipsis truncate">Net Worth</span> ${Util.formatNum(networth)}
                        </p>
                    </div>
                  
                </div>
                {selectedItem.id == 1 ? 
                <TextView/> :
                <div className="flex flex-col gap-5  relative">
                    <div className={`absolute w-full h-full transition-colors duration-75 bg-[#0f0f0f] z-30 top-0 left-0 rounded-md ${!hide ? "hidden" : ""}`}></div>
                    <Chart key={chartKey}/> 
                </div>}
                <div className="flex w-full gap-4 mb-10">
                    <Button
                        name="Reset Simulation"
                        highlight={false}
                        onSubmit={() => reset()}
                        style="w-[50%] flex gap-2 items-center whitespace-nowrap"
                        icon={<FaRedoAlt className="mt-0.5" size={13}/>}/>
                    <Button
                        name={`${running ? "Stop Simulations" : " Start Simulation"}`}
                        highlight={true}
                        onSubmit={() => {setRunning(!running)}}
                        style="w-[50%] flex gap-2 items-center"
                        icon={running ? <FaPause className="mt-0.5" size={13}/> : <FaPlay className="mt-0.5" size={13}/>}/>
                </div>
            </div>
        </div>
    )
}
