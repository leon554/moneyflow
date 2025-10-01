import NetWorthChart from "@/components/charts/NetWorthChart";



export default function TextView() {
    return (
        <div className="bg-panel1 p-3 outline-1 outline-border rounded-md flex flex-col gap-3">
            <p className=" text-title font-medium">
                Net Worth Over Time
            </p>
            <NetWorthChart/>
        </div>
    )
}
