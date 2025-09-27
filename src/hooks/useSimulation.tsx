import {  useState, useEffect, useRef} from "react"
import {add, sub} from "date-fns"
import type { IPayment, IPaymentHistory } from "@/Util/types"

interface Props{
    step: (date: Date) => IPayment[]
    resetBuckets: () => void
    simTimeoutId:  React.RefObject<NodeJS.Timeout | null>
}
export default function useSimulation({step, resetBuckets, simTimeoutId: simTimeOutId}: Props) {
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

            const payments = step(localDate)
            payments.length != 0 ? setPaymentHistory(prev => [...prev, {date: localDate, payments}]) : null
            
            setDate(localDate)
            simDays.current += 1
        }
        tick()
        intervalId.current = setInterval(tick, 1000)
    }

    function reset(){
        setIsRunning(false)
        stopSimulation()
        setDate(getStartSimulationDate())
        resetBuckets()
        setPaymentHistory([])
        simDays.current = 0
        if(!simTimeOutId) return
        if(simTimeOutId.current === null) return
        clearInterval(simTimeOutId.current)
    }

    return {running: isRunning, setRunning: setIsRunning, date, reset, paymentHistory}
}

function getStartSimulationDate(){
    return sub(new Date, {days: 1})
}