import { FaRegTrashAlt } from "react-icons/fa"
import { AccountType, type Source } from "@/Util/types"
import { Bucket } from "@/Util/classes/Bucket"
import { Util } from "@/Util/util"
import { useContext} from "react"
import { dataContext } from "@/providers/DataProvider"
import { FaRegEdit } from "react-icons/fa";
import { AlertContext } from "@/Alert/AlertProvider"


interface Props{
    bucket: Bucket
    setEdit: () => void
}
export default function BucketCard({bucket, setEdit}: Props) {

    const data = useContext(dataContext)
    const {alert} = useContext(AlertContext)

    function deleteBucket(){
        const hasReference = Array.from(data.bills.values()).some(b => b.billData.sourceBucketId == bucket.bucket.id)
        if(hasReference) {alert("Can't delete a bucket with bills referring to it, delete the bills that reference this bucket first"); return}
        data.deleteBucket(bucket.bucket.id!)
    }

    return (
        <div className="w-full bg-panel2 p-2 rounded-md text-subtext1 outline-1 outline-border2 flex justify-between items-center px-3">
            <div className="flex flex-col gap-2 w-[80%]">
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
                <div className="truncate text-xs max-w-[100%] text-subtext2 flex-1 overflow-ellipsis flex gap-2">
                    {bucket.bucket.sources.map((s: Source) => {
                        return (
                            <p>
                                {data.incomeSources.get(s.incomeSourceId)?.sourceData.name} pays <span className="text-highlight">{s.isPercentage ? `${s.allocation}%` : `$${s.allocation}`}</span>
                            </p>
                        )
                    })}
                </div>
            </div>
            <div className="flex gap-3">
                <div className="hover:cursor-pointer text-subtext2"
                    onClick={() => deleteBucket()}>
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
