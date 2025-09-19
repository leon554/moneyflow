import type { ReactNode } from "react"

interface Props{
    name: string | ReactNode
    onSubmit: () => Promise<void> | void
    icon?: ReactNode
    highlight: boolean
    style?: string
    small?: boolean
    xs?: boolean
    short?: boolean
    noAnimation?: boolean
}
export default function Button({name, onSubmit, icon, highlight: highligh, style, small, xs, noAnimation, short}: Props) {
    return (
        <button className={`shadow-sm shadow-gray-200 dark:shadow-none flex justify-center items-center 
            ${highligh ?
             `bg-highlight ${noAnimation ? "" : "hover:bg-highlight/93 hover:rounded-lg"} text-btn-text ` : 
                `outline-1  outline-border2   text-subtext3 bg-panel2
                ${noAnimation ? "" : "hover:bg-panel3 hover:rounded-lg"} `} 
            ${noAnimation ? "" : "transition-all duration-250 ease-in-out"} 
             text-sm  ${xs ? "h-6 text-xs" : small ? "h-7 px-3" : `${short ? "h-7" : "h-8"} 
             px-5 font-medium`} rounded-md  hover:cursor-pointer ${style}`}
            onClick={async () => {
                onSubmit()
            }}>
            {icon}{name}
        </button>
    )
}