import { dataContext } from "@/providers/DataProvider"
import { useContext, useEffect, useState } from "react"
import TextBoxLimited from "../primitives/TextboxLimited"
import Button from "../primitives/Button"
import type { SystemData } from "@/Util/types"
import type { dataFormat } from "../primitives/Select"
import Select from "../primitives/Select"
import { FaRegTrashAlt } from "react-icons/fa"




export default function CreateSystem() {

    const data = useContext(dataContext)

    const systemItems = data.systemData.map((d, i) => ({id: i, name: d.name, data: d.id})) as dataFormat[]
    const [name, setName] = useState("")
    const [createNew, setCreateNew] = useState(false)
    const [selectedSystem, setSelectedSystem] = useState<null | dataFormat>(null)

    function createSystem(){
        if(name == ""){alert("Enter a name first"); return}
        const newSystem = {name, id: crypto.randomUUID()} as SystemData
        data.setSystemData([...data.systemData, newSystem])
        data.setSelectedSystem(newSystem.id)
        setCreateNew(false)
        setName("")
    }

    function deleteSystem(id: string){
        if(data.selectedSystem == id){
            data.setSelectedSystem("")
        }
        if(selectedSystem?.data! == id){
            setSelectedSystem(null)
        }
        data.setSystemData([...data.systemData.filter(d => d.id != id)])
    }

    useEffect(() => {
        if(!selectedSystem) return
        data.setSelectedSystem(selectedSystem.data!)
    }, [selectedSystem])
    useEffect(() => {
        if(!data.selectedSystem) return
        setSelectedSystem(systemItems.find(i => i.data == data.selectedSystem)!)
    }, [data.selectedSystem])

    return (
        <div className="bg-panel1 outline-1 outline-border rounded-md p-4 flex flex-col gap-4">
            <h1 className="text-title text-lg font-medium ">
                {data.systemData.length == 0 || createNew ? "Create System" : "Select System" }
            </h1>

            {data.systemData.length == 0 || createNew ? 
            <>
                <TextBoxLimited 
                    name="Name"
                    charLimit={15}
                    value={name}
                    setValue={setName}
                    placeHolder="e.g Budget 1"
                    outerDivStyles="min-w-30"/>
                <div className="w-full flex gap-3">
                    {data.systemData.length > 0 ?
                    <Button
                        highlight={false}
                        name="Select System"
                        onSubmit={() => setCreateNew(false)}
                        style="w-full"/> 
                    : null}
                    <Button
                        highlight={false}
                        name="Create System"
                        onSubmit={() => createSystem()}
                        style="w-full"/>
                </div>
            </> : 
            <>
                <div className="flex flex-col gap-1.5 w-full">
                    <p className="text-xs font-medium text-subtext1 relative ">
                        Selected System
                    </p>
                    <Select
                        items={systemItems}
                        selectedItem={selectedSystem}
                        setSelectedItem={(id) => setSelectedSystem(systemItems[id])}
                        showIcon={true}
                        defaultText="Select System"
                        style="outline-1 w-full h-7 p-3 rounded-md text-lg font-medium text-highlight outline-highlight/30"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <hr className="text-border border-t w-full mt-1 mb-1"/>
                    <p className="text-xs font-medium text-subtext3 relative ">
                        Or
                    </p>
                    <hr className="text-border border-t w-full mt-1 mb-1"/>
                </div>
                <Button
                    highlight={false}
                    name="Create New System"
                    onSubmit={() => setCreateNew(true)}/>
                <div className="grid sm:grid-cols-2 gap-3">
                    {data.systemData.map(s => {
                        return(
                            <div className="bg-panel2 p-2 rounded-md text-subtext2 text-sm  outline-1 outline-border2 flex  items-center justify-between">
                                <p className="text-xs font-medium">
                                    {s.name}
                                </p>
                                <FaRegTrashAlt className="hover:text-subtext1 hover:cursor-pointer transition-all duration-200 ease-in-out"
                                    onClick={() => deleteSystem(s.id)}/>
                            </div>
                        )
                    })}
                </div>
            </>}
        </div>
    )
}
