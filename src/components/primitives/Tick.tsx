
interface Props{
    ticked: boolean,
    setTicked: (ticked: boolean) => void
}
export default function Tick({ticked, setTicked}: Props) {
    return (
        <div
            className={`bg-panel2 h-4 w-9 rounded-full outline-1 outline-border2 hover:cursor-pointer flex items-center `}
            onClick={() => setTicked(!ticked)}
            >
            <div
                className={`h-4 w-4  rounded-full transition-all duration-200 ease-out
                            ${ticked ? "translate-x-5 bg-highlight" : "translate-x-0 bg-subtext3"}`}
            ></div>
        </div>
    )
}
