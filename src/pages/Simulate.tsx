import { dataContext } from "@/providers/DataProvider"
import { useContext} from "react"
import IncomeSourceCard from "@/components/display/IncomeSourceCard"
import BucketCard from "@/components/display/bucketCard"
import { Util } from "@/Util/util"
import Button from "@/components/primitives/Button"
import useSimulation from "@/hooks/useSimulation"


export default function Simulate() {

    const data = useContext(dataContext)
    const {date, running, setRunning, reset, paymentHistory} = useSimulation()

    return (
        <div className="mt-20 m-auto max-w-[700px] w-[95%] flex flex-col gap-5">
            <h1 className="text-2xl text-title font-medium">
                Simulate
            </h1>
            <hr className="text-border border-t w-full"/>
            <div className="flex flex-col gap-2 bg-panel1 p-4 pt-3 outline-1 outline-border rounded-md">
                <h2 className="text-title font-medium">
                    Income Sources
                </h2>
                <div className="grid sm:grid-cols-2 gap-3">
                    {Array.from(data.incomeSources.values()).map(source => {
                        return(
                            <IncomeSourceCard source={source}/>
                        )
                    })}
                </div>
            </div>
            <div className="flex flex-col gap-2 bg-panel1 p-4 pt-3 outline-1 outline-border rounded-md">
                <h2 className="text-title font-medium">
                    Buckets
                </h2>
                <div className="grid sm:grid-cols-2 gap-3">
                    {Array.from(data.buckets.values()).map(b => {
                        return(
                            <BucketCard bucket={b}/>
                        )
                    })}
                </div>
            </div>
            <hr className="text-border border-t w-full"/>
            <p className="text-title">
                {Util.formatDate(date)}
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
                {Array.from(data.incomeSources.values()).map(source => {
                    return(
                        <div className="bg-panel1 p-3 rounded-md outline-1 outline-border text-subtext1 flex flex-col gap-1.5">
                            <p className="text-sm font-medium">
                                {source.sourceData.name}
                            </p>
                            <p className="text-xs text-subtext2">
                                Pays {source.sourceData.incomeAmount} on {Util.formatDate(new Date(source.sourceData.nextIncurralData))} {source.sourceData.incomeFrequency}
                            </p>
                        </div>
                    )
                })}
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
                {Array.from(data.buckets.values()).map(b => {
                    return(
                       <div className="bg-panel1 p-3 rounded-md outline-1 outline-border text-subtext1 flex flex-col gap-1.5">
                            <p className="text-sm font-medium">
                                {b.bucket.name}
                            </p>
                            <p className="text-xs text-subtext2">
                                ${b.bucket.balance}{b.bucket.targetBalance == 0 ? null : `/${b.bucket.targetBalance}`}
                            </p>
                       </div>
                    )
                })}
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
            <div className="mb-20 grid sm:grid-cols-2 gap-3">
                {paymentHistory.map(p => {
                    return(
                        <div className="bg-panel1 p-3 rounded-md outline-1 outline-border flex flex-col gap-1.5">
                            <p className="text-subtext1 text-sm font-medium">
                                {Util.formatDate(p.date)}
                            </p>
                            <div className="flex flex-col gap-1">
                                {p.payments.map(payment => {
                                    return(
                                        <div>
                                            <p className="text-xs text-subtext2">
                                                {payment.source} {"->"} ${payment.amount} {"->"} {payment.destination}
                                            </p>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
