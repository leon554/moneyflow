import { Util } from "@/Util/util"

interface Props{
    value: number
}

export default function ProgressBar({value}: Props) {
    return (
        <div className="flex  items-center gap-1.5">
            <div className="relative w-full h-2  outline-1 outline-border2 rounded-full">
                <div className="h-2 bg-highlight rounded-full"
                    style={{width: `${Math.min(value * 100, 100)}%`}}>
                </div>
            </div>
            <p className="text-xs text-subtext2">
                {Util.formatNum(Math.round(value * 100*100)/100)}%
            </p>
        </div>
    )
}
