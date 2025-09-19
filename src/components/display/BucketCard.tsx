import { FaRegTrashAlt } from "react-icons/fa"
import { AccountType, type Source } from "@/Util/types"
import { Bucket } from "@/Util/classes/Bucket"
import { Util } from "@/Util/util"
import { useContext } from "react"
import { dataContext } from "@/providers/DataProvider"


interface Props{
    bucket: Bucket
}
export default function BucketCard({bucket}: Props) {

    const data = useContext(dataContext)

    return (
        <div className="w-full bg-panel2 p-2 rounded-md text-subtext1 outline-1 outline-border2 flex justify-between items-center px-3">
            <div className="flex flex-col gap-1.5 w-[80%]">
                <div className="flex  gap-2 items-center ">
                    <p className="text-title">
                        {Util.capFirst(bucket.bucket.name)}
                    </p>
                    <p className="text-xs bg-btn text-btn-text px-1.5  py-[1px] rounded-full font-medium">
                        {bucket.bucket.accountType}
                    </p>
                    {bucket.bucket.accountType == AccountType.DeptAccount ? 
                    <p className="text-xs bg-btn text-btn-text px-1.5  py-[1px] rounded-full font-medium">
                        {bucket.bucket.interest}% 
                    </p> :
                    bucket.bucket.accountType == AccountType.SavingsAccount ? 
                    <p className="text-xs bg-btn text-btn-text px-1.5  py-[1px] rounded-full font-medium">
                        {bucket.bucket.interest}%
                    </p> : null}
                </div>
                <p className="truncate text-xs max-w-[100%] text-subtext2 flex-1 overflow-ellipsis">
                    {bucket.bucket.sources.map((s: Source) => `${s.sourceName} pays ${s.isPercentage ? `${s.allocation}%` : `$${s.allocation}`}`).join(", ")}
                </p>
            </div>
            <div className="hover:cursor-pointer text-subtext2"
                onClick={() => data.deleteBucket(bucket.bucket.name)}>
                <FaRegTrashAlt className="hover:text-subtext1 transition-all duration-200 ease-in-out"/>
            </div>
        </div>
    )
}
