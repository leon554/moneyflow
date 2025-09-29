import Select from "../primitives/Select"
import TextBoxLimited from "../primitives/TextboxLimited"
import Button from "../primitives/Button"
import { useContext, useEffect, useMemo, useState } from "react"
import { dataContext } from "@/providers/DataProvider"
import type { dataFormat } from "../primitives/Select"
import { FaRegTrashAlt } from "react-icons/fa"
import type { Source } from "@/Util/types"
import { FaPlus } from "react-icons/fa";
import { FaRegEdit } from "react-icons/fa";
import { FaSave } from "react-icons/fa"
import { Util } from "@/Util/util"
import type { Dispatch, SetStateAction } from "react"

interface Props{
    sources: Source[]
    setSources: Dispatch<SetStateAction<Source[]>>
    modifiedBucket: boolean
}
export default function SourceForm({sources, setSources, modifiedBucket}: Props) {

    const data = useContext(dataContext)

    let sourceItems = Array.from(data.incomeSources.values()).map((v,i) => ({id: i, name: v.sourceData.name, data: v.sourceData.id!}))
    const remainingItems = [{id: 0, name: "Yes"}, {id: 1, name: "No"}]
    const typeItems = [{id: 0, name: "%"}, {id: 1, name: "$"}]

    const [selectedSourceItem, setSelectedSourceItem] = useState<dataFormat>()
    const [selectedRemainingItem, setSelectedRemainingItem] = useState<dataFormat>(remainingItems[1])
    const [allocation, setAllocation] = useState("")
    const [selectedTypeItem, setSelectedTypeItem] = useState<dataFormat>(typeItems[0])

    const [isEditing, setIsEditing] = useState(false)
    const [editedSourceId, setEditedSourceId] = useState("")

    const selectedIncomeSource = data.incomeSources.get(selectedSourceItem?.data!)
    const tempSource: Source = {
        id: isEditing ? editedSourceId : crypto.randomUUID(), 
        incomeSourceId: selectedSourceItem?.data!, 
        bucketTargetId: "", 
        allocation: isNaN(Number(allocation)) ? 0 : Number(allocation), 
        isPercentage: selectedTypeItem.name == "%"
    }
    const filteredSources = sources.filter(s => s.incomeSourceId == selectedIncomeSource?.sourceData.id)
    const allocationData = useMemo(() => selectedIncomeSource?.getAllocatedDataWithTemp(filteredSources, tempSource, editedSourceId, data.buckets), [sources, filteredSources, tempSource, editedSourceId, data.buckets])

    useEffect(() => {
        if(selectedRemainingItem.name == "Yes"){
            setAllocation("")
        }
    }, [selectedRemainingItem])

    useEffect(() => {
        setIsEditing(false)
        setEditedSourceId("")
        setAllocation("")
        setSelectedSourceItem(undefined)
    }, [modifiedBucket])
  
    function addSource(){
        if(!selectedSourceItem) {alert("Select or create a source before creating this bucket"); return}
        if(allocation == "" && selectedRemainingItem.name == "No") {alert("Add allocation value"); return}
        if(selectedTypeItem.name == "%" && Number(allocation) > 100) {alert("can't have percentage higher than 100"); return}
        if(allocationData!.unAllocatedAmount < 0 ) {alert("Income source doesn't have enough money unallocated to create this source "); return}

        const newSource: Source = {
            id: crypto.randomUUID(),
            incomeSourceId: selectedSourceItem.data!,
            bucketTargetId: "",
            allocation: selectedRemainingItem.name == "Yes" ? 
                allocationData?.unAllocatedAmount ?? 0 :
                Number(allocation),
            isPercentage: selectedTypeItem.name == "%" && selectedRemainingItem.name == "No"
        }

        
        setSelectedRemainingItem(remainingItems[1])
        setAllocation("");

        if(isEditing){
            newSource.id = editedSourceId
            const updatedSourceIndex = sources.findIndex(s => s.id == editedSourceId)
            setSources([...sources.map((s, i) =>
                i === updatedSourceIndex ? {...s, ...newSource} : s
            )]);
            setIsEditing(false)
            setEditedSourceId("")
        }else{
            setSources([...sources, newSource])
        }
    }


    function enableEditMode(editId: string){
        setIsEditing(true)
        setEditedSourceId(editId)
        const source = sources.find(s => s.id == editId)!
        setSelectedSourceItem(sourceItems.find(s => s.data == source.incomeSourceId)!)
        setAllocation(source.allocation.toString())
        setSelectedTypeItem(source.isPercentage ? typeItems[0] : typeItems[1])
        setSelectedRemainingItem(remainingItems[1])

    }

    return (
        <div className="flex flex-col gap-4 border-t border-b  border-border2 py-4 pb-6">
            <h1 className="text-title  font-medium">
                Add Sources
            </h1>
            <div className="flex flex-col w-full gap-4 sm:flex-row">
                <div className="flex flex-col gap-1.5 w-full sm:w-fit">
                    <p className="text-xs font-medium text-subtext1 relative ">
                        Source
                    </p>
                    <Select
                        items={sourceItems}
                        defaultText="Select Source"
                        selectedItem={selectedSourceItem ?? null}
                        setSelectedItem={(id) => setSelectedSourceItem(sourceItems[id])}
                        showIcon={true}
                        center={true}
                        divStyles="sm:w-fit"
                    />
                </div>
                {(allocationData?.unAllocatedAmount ?? -1) > 0 || allocation != ""?
                    <>
                    {selectedRemainingItem.name == "Yes" ? 
                    null :
                    <>
                        <TextBoxLimited 
                            name="Allocation Amount"
                            charLimit={10}
                            numeric={true}
                            value={allocation}
                            setValue={setAllocation}
                            placeHolder="1200"
                            outerDivStyles="w-full"
                            invalidFunc={(_) => selectedSourceItem ? ((allocationData?.unAllocatedAmount ?? 0) < 0) : false}/>
                        <div className="flex flex-col gap-1.5">
                            <p className="text-xs font-medium text-subtext1 relative ">
                                Type
                            </p>
                            <Select
                                items={typeItems}
                                selectedItem={selectedTypeItem}
                                setSelectedItem={(id) => setSelectedTypeItem(typeItems[id])}
                                showIcon={true}
                                center={true}
                                divStyles="sm:w-fit"
                            />                
                        </div>
                    </>
                    }
                    <div className={`flex flex-col gap-1.5 ${selectedRemainingItem.name == "Yes" ? "w-full" : "w-fit"}`}>
                        <p className="text-xs font-medium text-subtext1 relative whitespace-nowrap ">
                            Allocate Remaining
                        </p>
                        <Select
                            items={remainingItems}
                            selectedItem={selectedRemainingItem}
                            setSelectedItem={(id) => setSelectedRemainingItem(remainingItems[id])}
                            showIcon={true}
                            divStyles=""
                        />                
                    </div>
                    </> : 
                    selectedSourceItem ? 
                    <div className="text-subtext2 text-xs flex  items-end mb-1.5">
                        Not enough money left, select or create different source.
                    </div> :
                    <div className="text-subtext2 text-xs flex  items-end mb-[8px]">
                        Select a source to continue
                    </div>
                }
            </div>
                {selectedSourceItem && (((allocationData?.unAllocatedAmount ?? 0) > 0) || allocation != "") ? 
                    <p className="text-subtext2 text-xs">
                       {selectedRemainingItem.name == "Yes" 
                        ? "The remaining $" + allocationData?.unAllocatedAmount + 
                        " from your " + selectedSourceItem.name + " will be allocated to this bucket"
                        : "$" + Math.round((allocationData?.unAllocatedAmount ?? 0) * 100)/100 + " unallocated" +
                        " and $" + Math.round((allocationData?.allocatedAmount ?? 0) * 100)/100 + " already allocated" +
                        ". " + (
                            ((allocationData?.unAllocatedAmount ?? 0) < 0)
                            ? "You DON'T have enough money left from the selected income source to create this source"
                            : "You have enough unallocated money left to create this source"
                        )}
                    </p>
                    : null
                }
            <Button 
                name={isEditing ? "Save" : "Add Source"}
                onSubmit={() => addSource()}
                highlight={false}
                style="w-full flex gap-1.5"
                icon={isEditing ?  <FaSave size={12}/> : <FaPlus size={12}/>}/>
            {sources.length != 0 ?
            <div className="grid sm:grid-cols-2 gap-3 ">
                {sources.map(s => {
                    return(
                        <div className=" w-full bg-panel2 p-2 rounded-md text-subtext1 outline-1 outline-border2 flex justify-between items-center px-3">
                            <div className="flex gap-1.5">
                                <p className="text-title">
                                    {data.incomeSources.get(s.incomeSourceId)!.sourceData.name}
                                </p>
                                <p className="text-xs bg-btn text-btn-text px-1.5 rounded-full font-medium  py-[1px]">
                                    {s.isPercentage ? `${s.allocation}%` : `${Util.formatNum(s.allocation, true)}`}
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="hover:cursor-pointer text-subtext2"
                                    onClick={() => {
                                        setSources(prev => [...prev.filter(source => source.incomeSourceId != s.incomeSourceId || source.allocation != s.allocation)])
                                        data.setUpdated(prev => !prev)
                                    }}>
                                    <FaRegTrashAlt className="hover:text-subtext1 transition-all duration-200 ease-in-out"/>
                                </div>
                                <div className="hover:cursor-pointer text-subtext2"
                                    onClick={() => {enableEditMode(s.id)}}>
                                    <FaRegEdit className="hover:text-subtext1 transition-all duration-200 ease-in-out"/>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div> : null
            }
        </div>
    )
}
