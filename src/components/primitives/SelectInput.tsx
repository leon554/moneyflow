import { useContext } from "react"
import Select, { type dataFormat } from "./Select"
import { IoInformationCircleOutline } from "react-icons/io5"
import { AlertContext } from "@/Alert/AlertProvider"

interface Props{
    data: {
        fullWidth: boolean
        name: string
        infoText: string
        items: dataFormat[]
        selectedItem: dataFormat | null
        setSelectedItem: (item: dataFormat) => void
        defaultText?:string
        center?: boolean
    }
}
export default function SelectInput({data}: Props) {

    const {alert} = useContext(AlertContext)

    return (
        <div className={`flex flex-col gap-1.5 ${data.fullWidth ? "w-full": "w-fit"} max-sm:w-full`}>
            <div className="flex items-center gap-1.5">
                <p className="text-xs font-medium text-subtext1 relative whitespace-nowrap">
                    {data.name}
                </p>
                <IoInformationCircleOutline className="text-subtext3 hover:cursor-pointer text-sm"
                    onClick={() => alert(data.infoText)}/>
            </div>
            <Select
                items={data.items}
                selectedItem={data.selectedItem}
                setSelectedItem={(id) => data.setSelectedItem(data.items[id])}
                showIcon={true}
                defaultText={data.defaultText}
                center={data.center}
            />
        </div>
    )
}
