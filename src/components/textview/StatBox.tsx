import { Util } from "@/Util/util"

interface Props{
    name: string
    value: number
    isMoney: boolean
    isPercent?: boolean
    isDuration?: boolean
}
export default function StatBox({name, value, isMoney, isPercent, isDuration}: Props) {
    return (
        <p className="text-subtext1 font-medium text-sm w-full flex justify-between">
            <span className="font-normal text-xs text-subtext2">{name}: </span> {Util.formatNum(value, isMoney)}{isPercent && "%"}{isDuration ? "mo" : ""}
        </p>
    )
}
