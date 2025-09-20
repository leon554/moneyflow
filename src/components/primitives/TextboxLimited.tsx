import { Util } from "@/Util/util"
import { useState, type ReactNode } from "react"
import { IoInformationCircleOutline } from "react-icons/io5"
import { IoMdEye, IoMdEyeOff } from "react-icons/io"


interface Props{
    name: string
    charLimit: number
    value: string 
    setValue: (value: string) => void
    placeHolder: string
    outerDivStyles?: string
    textArea?: boolean
    custom?: ReactNode
    numeric?: boolean
    password?: boolean
    infoText?: string
    negative?: boolean
    invalidFunc?: (value: string) => boolean
}
export default function TextBoxLimited({invalidFunc, negative = false, name, password, value, setValue, charLimit, placeHolder, outerDivStyles, textArea, custom, numeric, infoText}: Props) {
   
    const [showPass, setShowPass] = useState(false)

    return (
        <div className={`flex flex-col gap-1.5 relative ${outerDivStyles}`}>
            <div className="flex justify-between items-end ">
                <div className="flex  items-center gap-1.5">
                    <p className="text-xs font-medium text-subtext1 relative">
                        {name}
                    </p>
                    {infoText ? <IoInformationCircleOutline className="text-subtext3 hover:cursor-pointer text-sm mt-0.5"
                        onClick={() => alert(infoText)}/> : ""}
                </div>
                <p className="text-[10px] text-subtext3">
                    {(value ?? "").length}/{charLimit}
                </p>
            </div>
            {password ? 
            !showPass ? 
                
                <IoMdEyeOff className="absolute right-2 top-[33px] text-subtext3 hover:cursor-pointer" size={15} onClick={() => {setShowPass(true);}}/>:
                <IoMdEye className="absolute right-2 top-[33px] text-subtext3 hover:cursor-pointer" size={15} onClick={() => {setShowPass(false);}}/>
                
            : ""} 
            {textArea ? 
            <textarea 
                className="no-scrollbar shadow-sm shadow-gray-200 dark:shadow-none outline-1 outline-border2 rounded-md px-2 py-1.5 text-subtext3 text-xs h-20 resize-none"
                placeholder={placeHolder}
                value={value}
                onChange={e => Util.setValueLim(setValue, e.target.value, charLimit)}/>
            :
            <input type={!password || showPass ? "text" : "password"}
                className={`shadow-sm shadow-gray-200 dark:shadow-none outline-1 bg-panel2 ${invalidFunc && invalidFunc(value) ? "outline-red-500" : "outline-border2"}  rounded-md px-2 text-subtext3 text-xs h-7 `}
                style={{}}
                placeholder={placeHolder}
                value={value}
                onChange={e => numeric ? negative ? isNaN(Number(e.target.value)) && e.target.value != "-" ?
                        null :
                        Util.setValueLim(setValue, e.target.value, charLimit) :
                        isNaN(Number(e.target.value)) ?
                        null :
                        Util.setValueLim(setValue, e.target.value, charLimit):
                        Util.setValueLim(setValue, e.target.value, charLimit)}/>
            }
            {custom}
        </div>
    )
}
