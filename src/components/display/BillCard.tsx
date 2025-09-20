
import { FaRegTrashAlt } from "react-icons/fa"
import { Util } from "@/Util/util"
import type { Bill } from "@/Util/classes/Bill"


interface Props{
    bill: Bill
}
export default function BillCard({bill}: Props) {

    return (
        <div className="w-full bg-panel2 p-2 rounded-md text-subtext1 outline-1 outline-border2 flex justify-between items-center px-3">
            <div className="flex flex-col gap-1.5 w-[90%] ">
                <div className="flex  gap-2 items-center ">
                    <p className="text-title">
                        {Util.capFirst(bill.billData.name)}
                    </p>
                   
                </div>

                <p className="max-w-[100%] truncate text-subtext2 text-xs whitespace-nowrap overflow-ellipsis">
                    ${bill.billData.amount} {Util.capFirst(bill.billData.frequency)} from "{bill.billData.sourceBucketName}" bucket
                </p>

            </div>
            <div className="hover:cursor-pointer text-subtext2"
                onClick={() => {}}>
                <FaRegTrashAlt className="hover:text-subtext1 transition-all duration-200 ease-in-out"/>
            </div>
        </div>
    )
}
