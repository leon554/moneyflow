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
import useForm from "@/hooks/useForm"
import { AlertContext } from "@/Alert/AlertProvider"

interface Props{
    sources: Source[]
    setSources: (sources: Source[]) => void
    modifiedBucket: boolean
}
export default function CreateSourceForm({sources, setSources, modifiedBucket}: Props) {

    const data = useContext(dataContext)
    const {alert} = useContext(AlertContext)

    let incomeSourceItems = Array.from(data.incomeSources.values()).map((v,i) => ({id: i, name: v.sourceData.name, data: v.sourceData.id!}))
    const remainingItems = [{id: 0, name: "Yes"}, {id: 1, name: "No"}]
    const typeItems = [{id: 0, name: "%"}, {id: 1, name: "$"}]

    const {form, setForm, resetForm, setWholeForm} = useForm({
        selectedIncomeSourceItem: undefined as dataFormat | undefined,
        selectedRemainingItem: remainingItems[1] as dataFormat,
        selectedTypeItem: typeItems[0] as dataFormat,
        allocation: ""
    })

    const [editData, setEditData] = useState({isEditing: false, sourceId: ""})
    const [deletedSourceIds, setDeletedSourceIds] = useState<string[]>([])

    const selectedIncomeSource = data.incomeSources.get(form.selectedIncomeSourceItem?.data!)

    const tempSource: Source = {
        id: editData.isEditing ? editData.sourceId : crypto.randomUUID(), 
        incomeSourceId: form.selectedIncomeSourceItem?.data!, 
        bucketTargetId: "", 
        allocation: isNaN(Number(form.allocation)) ? 0 : Number(form.allocation), 
        isPercentage: form.selectedTypeItem.name == "%"
    }

    const selectedIncomeSourceSources = sources.filter(s => s.incomeSourceId == selectedIncomeSource?.sourceData.id)
    const allocationData = useMemo(() => 
        selectedIncomeSource?.getAllocatedDataWithTemp(selectedIncomeSourceSources, tempSource, [editData.sourceId, ...deletedSourceIds], data.buckets), 
    [sources, selectedIncomeSourceSources, tempSource, editData.sourceId, data.buckets])

    useEffect(() => {
        if(form.selectedRemainingItem.name != "Yes") return
        setForm("allocation", "")
    }, [form.selectedRemainingItem])

    useEffect(() => {
        setEditData({isEditing: false, sourceId: ""})
        setForm("allocation", "")
        setForm("selectedIncomeSourceItem", undefined)
    }, [modifiedBucket])
  
    function addSource(){
        if(!isValidForm()) return

        const newSource: Source = {
            id: crypto.randomUUID(),
            incomeSourceId: form.selectedIncomeSourceItem!.data!,
            bucketTargetId: "",
            allocation: form.selectedRemainingItem.name == "Yes" ? 
                allocationData?.unAllocatedAmount ?? 0 :
                Number(form.allocation),
            isPercentage: form.selectedTypeItem.name == "%" && form.selectedRemainingItem.name == "No"
        }
         
        if(editData.isEditing){
            newSource.id = editData.sourceId
            const sourceToUpdateIndex = sources.findIndex(s => s.id == editData.sourceId)
            const updatedSourceArr = sources.map((s, i) =>
                i === sourceToUpdateIndex ? {...s, ...newSource} : s
            )
            setSources([...updatedSourceArr])
        }else{
            setSources([...sources, newSource])
        }
        
        setEditData({isEditing: false, sourceId: ""})
        setForm("selectedRemainingItem", remainingItems[1])
        setForm("allocation", "")
        setDeletedSourceIds([])
        resetForm()
    }

    function isValidForm(){
        if(!form.selectedIncomeSourceItem) {alert("Select or create a source before creating this bucket"); return false}
        if(form.allocation == "" && form.selectedRemainingItem.name == "No") {alert("Add allocation value"); return false}
        if(form.selectedTypeItem.name == "%" && Number(form.allocation) > 100) {alert("Can't have percentage higher than 100"); return false}
        if(allocationData!.unAllocatedAmount < 0 ) {alert("Income source doesn't have enough money unallocated to create this source "); return false;}
        return true
    }

    function enableEditMode(editId: string){
        setEditData({isEditing: true, sourceId: editId})
        const source = sources.find(s => s.id == editId)!

        setWholeForm({
            ...form,
            selectedIncomeSourceItem: incomeSourceItems.find(s => s.data == source.incomeSourceId)!,
            allocation: source.allocation.toString(),
            selectedTypeItem: source.isPercentage ? typeItems[0] : typeItems[1],
            selectedRemainingItem: remainingItems[1]
        })
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
                        items={incomeSourceItems}
                        defaultText="Select Source"
                        selectedItem={form.selectedIncomeSourceItem ?? null}
                        setSelectedItem={(id) => setForm("selectedIncomeSourceItem", incomeSourceItems[id])}
                        showIcon={true}
                        center={true}
                        divStyles="sm:w-fit"
                    />
                </div>
                {(allocationData?.unAllocatedAmount ?? -1) > 0 || form.allocation != ""?
                    <>
                    {form.selectedRemainingItem.name == "Yes" ? 
                    null :
                    <>
                        <TextBoxLimited 
                            name="Allocation Amount"
                            charLimit={10}
                            numeric={true}
                            value={form.allocation}
                            setValue={value => setForm("allocation", value)}
                            placeHolder="1200"
                            outerDivStyles="w-full"
                            invalidFunc={(_) => form.selectedIncomeSourceItem ? ((allocationData?.unAllocatedAmount ?? 0) < 0) : false}/>
                        <div className="flex flex-col gap-1.5">
                            <p className="text-xs font-medium text-subtext1 relative ">
                                Type
                            </p>
                            <Select
                                items={typeItems}
                                selectedItem={form.selectedTypeItem}
                                setSelectedItem={(id) => setForm("selectedTypeItem", typeItems[id])}
                                showIcon={true}
                                center={true}
                                divStyles="sm:w-fit"
                            />                
                        </div>
                    </>
                    }
                    <div className={`flex flex-col gap-1.5 ${form.selectedRemainingItem.name == "Yes" ? "w-full" : "w-fit"}`}>
                        <p className="text-xs font-medium text-subtext1 relative whitespace-nowrap ">
                            Allocate Remaining
                        </p>
                        <Select
                            items={remainingItems}
                            selectedItem={form.selectedRemainingItem}
                            setSelectedItem={(id) => setForm("selectedRemainingItem", remainingItems[id])}
                            showIcon={true}
                            divStyles=""
                        />                
                    </div>
                    </> : 
                    form.selectedIncomeSourceItem ? 
                    <div className="text-subtext2 text-xs flex  items-end mb-1.5">
                        Not enough money left, select or create different source.
                    </div> :
                    <div className="text-subtext2 text-xs flex  items-end mb-[8px]">
                        Select a source to continue
                    </div>
                }
            </div>
                {form.selectedIncomeSourceItem && (((allocationData?.unAllocatedAmount ?? 0) > 0) || form.allocation != "") ? 
                    <p className="text-subtext2 text-xs">
                       {form.selectedRemainingItem.name == "Yes" 
                        ? "The remaining $" + allocationData?.unAllocatedAmount + 
                        " from your " + form.selectedIncomeSourceItem.name + " will be allocated to this bucket"
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
                name={editData.isEditing ? "Save" : "Add Source"}
                onSubmit={() => addSource()}
                highlight={false}
                style="w-full flex gap-1.5"
                icon={editData.isEditing ?  <FaSave size={12}/> : <FaPlus size={12}/>}/>
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
                                        setDeletedSourceIds(prev => [...prev, s.id])
                                        setSources([...sources.filter(source => source.incomeSourceId != s.incomeSourceId || source.allocation != s.allocation)])
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
