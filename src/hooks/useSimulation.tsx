import { useContext, useState, useEffect, useRef} from "react"
import { dataContext } from "@/providers/DataProvider"
import {add, sub} from "date-fns"
import type { IPaymentHistory } from "@/Util/types"


export default function useSimulation() {
    const data = useContext(dataContext)

    const [date, setDate] = useState(getStartSimulationDate())
    const [isRunning, setIsRunning] = useState(false)
    const [paymentHistory, setPaymentHistory] = useState<IPaymentHistory[]>([])

    const intervalId = useRef<NodeJS.Timeout | null>(null)
    const simDays = useRef(0)

    useEffect(() => {
        if(isRunning){
            startSimulationInterval()
        }
        else if(intervalId.current){
            stopSimulation()
        }
        return stopSimulation
    }, [isRunning])

    function stopSimulation() {
        if (!intervalId.current) return
        clearInterval(intervalId.current)
        intervalId.current = null
    }
    
    function startSimulationInterval(){
        function tick(){
            const localDate = add(new Date, {days: simDays.current})

            const payments = data.step(localDate)
            payments.length != 0 ? setPaymentHistory(prev => [...prev, {date: localDate, payments}]) : null
            
            setDate(localDate)
            simDays.current += 1
        }
        tick()
        intervalId.current = setInterval(tick, 1000)
    }

    function reset(){
        setIsRunning(false)
        setDate(getStartSimulationDate())
        data.resetBuckets()
        setPaymentHistory([])
        simDays.current = 0
    }

    return {running: isRunning, setRunning: setIsRunning, date, reset, paymentHistory}
}

function getStartSimulationDate(){
    return sub(new Date, {days: 1})
}