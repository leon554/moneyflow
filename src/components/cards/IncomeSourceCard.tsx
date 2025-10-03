import { dataContext } from "@/providers/DataProvider"
import type { IncomeSource } from "@/Util/classes/IncomeSource"
import { Util } from "@/Util/util"
import { useContext } from "react"
import { FaRegTrashAlt } from "react-icons/fa"
import { FaRegEdit } from "react-icons/fa";


interface Props{
    source: IncomeSource
    setEdit: () => void
}
export default function IncomeSourceCard({source, setEdit}: Props) {

    const data = useContext(dataContext)

    function deleteIncomeSource(){
        if(source.destinationBucketsIds.length != 0){
            alert("You can't delete this income source as some buckets references it delete them first")
            return
        }
        data.deleteIncomeSource(source.sourceData.id!)
    }

    return (
        <div className="w-full bg-panel2 p-2 rounded-md text-subtext1 outline-1 outline-border2 flex justify-between items-center px-3">
            <div className=" flex flex-col gap-2">
                <div className="flex  gap-2 items-center">
                    <p className="text-title">
                        {Util.capFirst(source.sourceData.name)}
                    </p>
                    <p className="text-xs bg-btn text-btn-text px-1 rounded-full font-medium  py-[1px]">
                        {Util.formatNum(source.sourceData.incomeAmount, true)}
                    </p>
                </div>
                <div className="text-xs flex gap-1 text-subtext2">
                    <p>
                        Paid <span className="text-highlight">{source.sourceData.incomeFrequency}</span>
                    </p>
                    <p>
                        starting on {Util.formatDate(new Date(source.sourceData.nextIncurralDate))}
                    </p>
                </div>
            </div>
            <div className="flex items-center gap-3">
                <div className="hover:cursor-pointer text-subtext2"
                    onClick={deleteIncomeSource}>
                    <FaRegTrashAlt className="hover:text-subtext1 transition-all duration-200 ease-in-out"/>
                </div>
                <div className="hover:cursor-pointer text-subtext2"
                    onClick={() => setEdit()}>
                    <FaRegEdit className="hover:text-subtext1 transition-all duration-200 ease-in-out"/>
                </div>
            </div>
        </div>
    )
}
