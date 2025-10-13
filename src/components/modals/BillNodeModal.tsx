import type { Bill } from "@/Util/classes/Bill"
import { Util } from "@/Util/util"
import Button from "../primitives/Button"


interface Props{
    bill: Bill
    setOpen: (open: boolean) => void
}
export default function BillNodeModal({bill, setOpen}: Props) {
    const dailyCost = Util.getPayPerDay(bill.billData.amount, bill.billData.frequency)

    return (
        <div className="bg-panel1 outline-1 outline-border rounded-md p-5 flex flex-col gap-1.5 max-w-[400px] w-[90%]"
            onClick={e => e.stopPropagation()}
        >
            <p className="text-title font-medium leading-none mb-1.5">
                {Util.capFirst(bill.billData.name)}
            </p>
            <hr className="text-border border-t w-full mt-2"/>
            <p className="text-xs text-title font-medium leading-none mb-1 mt-2">
                Overview
            </p>
            <p className="text-xs text-subtext1 flex justify-between">
               Due {bill.billData.frequency}: <span className="font-medium text-title">${bill.billData.amount}</span> 
            </p>
            <p className="text-xs text-subtext1 flex justify-between">
               Due on: <span className="font-medium text-title">{Util.formatDate(new Date(bill.billData.nextIncurralDate))}</span>
            </p>
            <p className="text-xs text-subtext1 flex justify-between">
               Total Paid: <span className="font-medium text-title">${bill.billData.balance}</span>
            </p>
            <hr className="text-border border-t w-full mt-2"/>
            <p className="text-xs text-title font-medium leading-none mb-1 mt-2">
                Avg Cost Per Period
            </p>
            <div className="grid sm:grid-cols-2 grid-cols-1 gap-y-1.5 gap-x-7">
                <p className="text-xs text-subtext1 flex justify-between">
                    Daily: <span className="font-medium text-title">${Util.formatNum(dailyCost)}</span>
                </p>
                <p className="text-xs text-subtext1 flex justify-between">
                    Weekly: <span className="font-medium text-title">${Util.formatNum(dailyCost * 7)}</span>
                </p>
                <p className="text-xs text-subtext1 flex justify-between">
                    Fortnightly: <span className="font-medium text-title">${Util.formatNum(dailyCost * 14)}</span>
                </p>
                <p className="text-xs text-subtext1 flex justify-between">
                    Monthly: <span className="font-medium text-title">${Util.formatNum(dailyCost * 30.42)}</span>
                </p>
                <p className="text-xs text-subtext1 flex justify-between">
                    Quarterly: <span className="font-medium text-title">${Util.formatNum(dailyCost * 91.25)}</span>
                </p>
                <p className="text-xs text-subtext1 flex justify-between">
                    Yearly: <span className="font-medium text-title">${Util.formatNum(dailyCost * 365.25)}</span>
                </p>
            </div>
            <Button
                name="Done"
                highlight={true}
                short={true}
                onSubmit={() => setOpen(false)}
                noAnimation={true}
                style="mt-2"/>
        </div>
    )
}
