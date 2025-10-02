import Button from "@/components/primitives/Button";
import DateInput from "@/components/primitives/DateInput";
import Select, { type dataFormat } from "@/components/primitives/Select";
import TextBoxLimited from "@/components/primitives/TextboxLimited";
import { dataContext } from "@/providers/DataProvider";
import { IncomeSource } from "@/Util/classes/IncomeSource";
import { IncurralFrequency, type IncomeDataType } from "@/Util/types";
import { Util } from "@/Util/util";
import { useContext, useState } from "react";
import IncomeSourceCard from "../cards/IncomeSourceCard";
import { FaPlus, FaSave } from "react-icons/fa";
import useForm from "@/hooks/useForm";



export default function CreateIncomeSource() {

    const [editData, setEditData] = useState({isInEditMode: false, editId: ""})
    const {form, setForm, setWholeForm, resetForm} = useForm({
        name: "",
        amount: "",
        date: Util.formatDate(new Date()),
        selectedFrequencyItem: Util.frequencyItems[0] as dataFormat
    })

    const data = useContext(dataContext)

    function handleSubmit(){
        if(form.name == "" || form.amount == "" || form.date == "") {alert("fill in all fields"); return}

        const sourceData: IncomeDataType = {
            systemId: data.selectedSystem,
            name: form.name,
            incomeAmount: Number(form.amount),
            incomeFrequency: form.selectedFrequencyItem.name as IncurralFrequency,
            nextIncurralDate: Util.stringToDate(form.date).getTime()
        }

        const newIncomeSource = new IncomeSource(sourceData) 
        if(!editData.isInEditMode){data.addIncomeSource(newIncomeSource); return}

        newIncomeSource.sourceData.id = editData.editId
        newIncomeSource.destinationBucketsIds = [...data.incomeSources.get(editData.editId)!.destinationBucketsIds]
        setEditData({isInEditMode: false, editId: ""})

        data.addIncomeSource(newIncomeSource)
        resetForm()
    }

    function populateFormFields(id: string){
        const incomeSource = data.incomeSources.get(id)
        if(!incomeSource) return new Error("Id provided doesn't match existing income source")
        
        setWholeForm({
            ...form,
            name: incomeSource.sourceData.name,
            amount: incomeSource.sourceData.incomeAmount.toString(),
            date: Util.formatDate(new Date(incomeSource.sourceData.nextIncurralDate)),
            selectedFrequencyItem: Util.frequencyItems.find(i => i.name == incomeSource.sourceData.incomeFrequency)!
        })
    }

    function onEditClick(incomeSourceID: string){
        setEditData({isInEditMode: true, editId: incomeSourceID})
        populateFormFields(incomeSourceID)
    }

    return (
        <div className="outline-1 bg-panel1 outline-border rounded-md p-4 flex flex-col gap-4">
            <h1 className="text-title text-lg font-medium ">
                Add Income
            </h1>
            <div className="flex flex-col w-full justify-between gap-4 sm:flex-row">
                <TextBoxLimited 
                    name="Name"
                    charLimit={15}
                    value={form.name}
                    setValue={value => setForm("name", value)}
                    placeHolder="e.g Wage"
                    />
                <TextBoxLimited 
                    name="Amount"
                    charLimit={10}
                    numeric={true}
                    value={form.amount}
                    setValue={value => setForm("amount", value)}
                    placeHolder="1200"/>
                <div className="flex flex-col gap-1.5 w-full">
                    <p className="font-medium text-subtext1 relative text-xs">
                        Next Payment
                    </p>
                    <DateInput
                        date={form.date}
                        setDate={value => setForm("date", value)}
                        />
                </div>
                <div className="flex flex-col gap-1.5 w-full">
                    <p className="text-xs font-medium text-subtext1 relative ">
                        Frequency
                    </p>
                    <Select
                        items={Util.frequencyItems}
                        selectedItem={form.selectedFrequencyItem}
                        setSelectedItem={(id) => setForm("selectedFrequencyItem", Util.frequencyItems[id])}
                        showIcon={true}
                        center={true}
                    />
                </div>
            </div>
            <div className="flex w-full gap-7 items-end justify-end">
                <Button 
                    icon={editData.isInEditMode ? <FaSave size={12}/> : <FaPlus size={12}/>}
                    name={editData.isInEditMode ? "Save" : "Add"}
                    onSubmit={() => handleSubmit()}
                    highlight={false}
                    style="w-full flex gap-1.5 items-center"/>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
                {Array.from(data.incomeSources.values()).map(source => {
                    return(
                        <IncomeSourceCard source={source} setEdit={() => onEditClick(source.sourceData.id!)}/>
                    )
                })}
            </div>
        </div>
    )
}
