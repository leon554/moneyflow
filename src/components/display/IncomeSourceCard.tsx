import { dataContext } from "@/providers/DataProvider"
import type { IncomeSource } from "@/Util/classes/IncomeSource"
import { Util } from "@/Util/util"
import { useContext } from "react"
import { FaRegTrashAlt } from "react-icons/fa"


interface Props{
    source: IncomeSource
}
export default function IncomeSourceCard({source}: Props) {

    const data = useContext(dataContext)

    return (
        <div className="w-full bg-panel2 p-2 rounded-md text-subtext1 outline-1 outline-border2 flex justify-between items-center px-3">
            <div className=" flex flex-col gap-1.5">
                <div className="flex  gap-2 items-center">
                    <p className="text-title">
                        {Util.capFirst(source.sourceData.name)}
                    </p>
                    <p className="text-xs bg-btn text-btn-text px-1 rounded-full font-medium  py-[1px]">
                        ${source.sourceData.incomeAmount}
                    </p>
                </div>
                <div className="text-xs flex gap-1 text-subtext2">
                    <p>
                        Paid {source.sourceData.incomeFrequency}
                    </p>
                    <p>
                        starting on {Util.formatDate(new Date(source.sourceData.nextIncurralData))}
                    </p>
                </div>
            </div>
            <div className="hover:cursor-pointer text-subtext2"
                onClick={() => data.deleteIncomeSource(source.sourceData.name)}>
                <FaRegTrashAlt className="hover:text-subtext1 transition-all duration-200 ease-in-out"/>
            </div>
        </div>
    )
}
