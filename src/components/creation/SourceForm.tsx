import Select from "../primitives/Select"
import TextBoxLimited from "../primitives/TextboxLimited"
import Button from "../primitives/Button"
import { useContext, useState } from "react"
import { dataContext } from "@/providers/DataProvider"
import type { dataFormat } from "../primitives/Select"
import { FaRegTrashAlt } from "react-icons/fa"
import type { Source } from "@/Util/types"


interface Props{
    sources: Source[]
    setSources: (source: Source[]) => void
}
export default function SourceForm({sources, setSources}: Props) {

    const data = useContext(dataContext)

    let sourceItems = Array.from(data.incomeSources.values()).map((v,i) => ({id: i, name: v.sourceData.name}))
    const remainingItems = [{id: 0, name: "Yes"}, {id: 1, name: "No"}]
    const typeItems = [{id: 0, name: "%"}, {id: 1, name: "$"}]

    const [selectedSourceItem, setSelectedSourceItem] = useState<dataFormat>()
    const [selectedRemainingItem, setSelectedRemainingItem] = useState<dataFormat>(remainingItems[1])
    const [allocation, setAllocation] = useState("")
    const [selectedTypeItem, setSelectedTypeItem] = useState<dataFormat>(typeItems[0])

    const proposedAllocation = {sourceName: selectedSourceItem?.name ?? "undefined", allocation: Number(allocation), isPercentage: selectedTypeItem.name == "%"}
    const allAllocations = [...sources, proposedAllocation].filter(a => a.sourceName == selectedSourceItem?.name)
    const filteredSources = [...sources].filter(a => a.sourceName == selectedSourceItem?.name)
    const enoughMoney = (selectedSourceItem && data.incomeSources.get(selectedSourceItem.name)!.getAllocatedData(filteredSources).unAllocatedAmount > 0) ?? false

    function addSource(){
        if(!selectedSourceItem) {alert("Select or create a source before creating this bucket"); return}
        if(allocation == "" && selectedRemainingItem.name == "No") {alert("Add allocation value"); return}
        if(selectedTypeItem.name == "%" && Number(allocation) > 100) {alert("can't have percentage higher than 100"); return}

        const newSource: Source = {
            sourceName: selectedSourceItem.name,
            allocation: selectedRemainingItem.name == "Yes" ? 
                data.incomeSources.get(selectedSourceItem.name)!.getAllocatedData(allAllocations).unAllocatedAmount: 
                Number(allocation),
            isPercentage: selectedTypeItem.name == "%" && selectedRemainingItem.name == "No"
        }

        setSelectedRemainingItem(remainingItems[1])
        setAllocation("");
        setSources([...sources, newSource])
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
                {enoughMoney ?
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
                            invalidFunc={(_) => selectedSourceItem ? !data.incomeSources.get(selectedSourceItem.name)!.canAffordAllocation(allAllocations) : false}/>
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
                {selectedSourceItem && enoughMoney ? 
                    <p className="text-subtext2 text-xs">
                        {selectedRemainingItem.name == "Yes" ? 
                        "The remaining $" + data.incomeSources.get(selectedSourceItem.name)!.getAllocatedData(allAllocations).unAllocatedAmount + 
                        " from your " + selectedSourceItem.name + " will be allocated to this bucket":
                        "$" + data.incomeSources.get(selectedSourceItem.name)!.getAllocatedData(allAllocations).unAllocatedAmount + " unallocated" +
                        " and $" + data.incomeSources.get(selectedSourceItem.name)!.getAllocatedData(allAllocations).allocatedAmount + " all ready allocated" +
                        ". " + (data.incomeSources.get(selectedSourceItem.name)!.canAffordAllocation(allAllocations) ? 
                        "You have enough unallocated money left to create this source" : 
                        "You DON'T have enough money left from the selected income source to create this source")}
                    </p>
                    : null
                }
            <Button 
                name="Add Source"
                onSubmit={() => addSource()}
                highlight={false}
                style="w-full"/>
            {sources.length != 0 ?
            <div className="grid sm:grid-cols-2 gap-3 ">
                {sources.map(s => {
                    return(
                        <div className=" w-full bg-panel2 p-2 rounded-md text-subtext1 outline-1 outline-border2 flex justify-between items-center px-3">
                            <div className="flex gap-1.5">
                                <p className="text-title">
                                    {s.sourceName}
                                </p>
                                <p className="text-xs bg-btn text-btn-text px-1.5 rounded-full font-medium  py-[1px]">
                                    {s.isPercentage ? `${s.allocation}%` : `$${s.allocation}`}
                                </p>
                            </div>
                            <div className="hover:cursor-pointer text-subtext2"
                                onClick={() => setSources([...sources.filter(source => source.sourceName != s.sourceName || source.allocation != s.allocation)])}>
                                <FaRegTrashAlt className="hover:text-subtext1 transition-all duration-200 ease-in-out"/>
                            </div>
                        </div>
                    )
                })}
            </div> : null
            }
        </div>
    )
}
