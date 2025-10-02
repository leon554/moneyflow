import { dataContext } from "@/providers/DataProvider"
import { useContext } from "react"
import Button from "../primitives/Button"


interface Props{
    setPage: (id: number) => void
}
export default function AddSystemFirst({setPage}: Props) {

    const data = useContext(dataContext)

    return (
        <div className="bg-panel1 p-4 outline-1 outline-border rounded-md flex justify-between gap-4">
            <h1 className="text-title text-lg font-medium ">
                {data.systemData.length == 0 ? "Create A System First" : "Select A System First"}
            </h1>
            <Button
                name={data.systemData.length == 0 ? "Create System " : "Select System"}
                highlight={false}
                onSubmit={() => setPage(-1)}/>
        </div>
    )
}
