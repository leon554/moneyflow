import { useContext, useEffect, useState } from "react";
import StatBox from "./StatBox";
import { dataContext } from "@/providers/DataProvider";
import { Bucket } from "@/Util/classes/Bucket";
import { AccountType } from "@/Util/types";
import type { IncomeSource } from "@/Util/classes/IncomeSource";
import type { Bill } from "@/Util/classes/Bill";



export default function Stats() {

    const data = useContext(dataContext)

    const bucketData = calculateBucketData(Array.from(data.buckets.values()))
    const [flowData, setFlowData] = useState({inflow: 0, outflow: 0, netflow: 0})

    useEffect(() => {
        const inOutFlows = getFlowData(Array.from(data.buckets.values()), data.incomeSources, data.bills)
        setFlowData({...inOutFlows, netflow: inOutFlows.inflow - inOutFlows.outflow})
    }, [])

    return (
        <div className="bg-panel1 p-3 outline-1 outline-border rounded-md flex flex-col gap-3">
            <p className=" text-title font-medium">
                Simulation Stats
            </p>
            <div className="grid sm:grid-cols-2 grid-cols-1 gap-x-10 gap-y-3">
                <StatBox name="Total Interest Earned" value={bucketData.interestEarned} isMoney={true}/>
                <StatBox name="Total Interest Payed" value={bucketData.interestPaid} isMoney={true}/>
                <StatBox name="Avg Daily In-flow" value={flowData.inflow} isMoney={true}/>
                <StatBox name="Avg Daily Out-flow" value={flowData.outflow} isMoney={true}/>
                <StatBox name="Avg Yearly In-flow" value={flowData.inflow*365.25} isMoney={true}/>
                <StatBox name="Avg Yearly Out-flow" value={flowData.outflow*365.25} isMoney={true}/>
                <StatBox name="Avg Daily Net-flow" value={flowData.netflow} isMoney={true}/>
                <StatBox name="Avg Yearly Net-flow" value={flowData.netflow*365.25} isMoney={true}/>
            </div>
        </div>
    )
}

function getFlowData(buckets: Bucket[], incomeSources: Map<string, IncomeSource>, Bills: Map<string, Bill>){
    let inflow = 0
    let outflow = 0 
    for(const bucket of buckets){
        inflow += bucket.getDailyInFlow(incomeSources)
        outflow += bucket.getDailyOutFlow(Bills)
    }
    return {inflow, outflow}
}
function calculateBucketData(buckets: Bucket[]){
    const bucketData = {
        bucketCount: buckets.length,
        interestEarned: 0,
        interestPaid: 0,
        avgDailyInflow: 0,
        avgDailyOutFlow: 0
    }


    for(const bucket of buckets){
        if(bucket.bucket.accountType == AccountType.SavingsAccount){
            bucketData.interestEarned += bucket.interestAmount
        }
        if(bucket.bucket.accountType == AccountType.DeptAccount){
            bucketData.interestPaid += bucket.interestAmount
        }
    }

    return bucketData
}
