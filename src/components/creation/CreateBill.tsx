import Button from "@/components/primitives/Button";
import DateInput from "@/components/primitives/DateInput";
import Select, { type dataFormat } from "@/components/primitives/Select";
import TextBoxLimited from "@/components/primitives/TextboxLimited";
import { dataContext } from "@/providers/DataProvider";
import { IncurralFrequency, type BillData} from "@/Util/types";
import { Util } from "@/Util/util";
import { useContext, useState } from "react";
import BillCard from "../cards/BillCard";
import { Bill } from "@/Util/classes/Bill";
import { FaSave, FaPlus } from "react-icons/fa";
import useForm from "@/hooks/useForm";
import { AlertContext } from "@/Alert/AlertProvider";

export default function CreateBill() {

    const data = useContext(dataContext)
    const {alert} = useContext(AlertContext)

    const frequencyItems = Object.values(IncurralFrequency).map((v,i) => ({id: i, name: Util.capFirst(v)}))
    const sourceItems = Array.from(data.buckets.values()).map((b,i) => ({id: i, name: Util.capFirst(b.bucket.name), data: b.bucket.id!}))

    const {form, setForm, resetForm, setWholeForm} = useForm({
        name: "",
        amount: "",
        date: Util.formatDate(new Date()),
        selectedFrequencyItem: frequencyItems[0] as dataFormat,
        selectedSourceItem: null as dataFormat | null
    })

    const [edit, setEdit] = useState({isInEditMode: false, editId: ""})


    function addBill(){
        if(form.name == "" || form.amount == "" || form.date == "") {alert("fill in all fields"); return}
        if(!form.selectedSourceItem) {alert("Select or create a bucket source first"); return}
        if(data.selectedSystem == ""){alert("Select valid system first"); return}

        const billData: BillData= {
            systemId: data.selectedSystem,
            name: form.name,
            sourceBucketId: form.selectedSourceItem.data!,
            amount: Number(form.amount),
            balance: 0,
            frequency: form.selectedFrequencyItem.name.toLowerCase() as IncurralFrequency,
            nextIncurralDate: Util.stringToDate(form.date).getTime()
        }
        const newBill = new Bill(billData)

        if(edit.isInEditMode){
            newBill.billData.id = edit.editId
            setEdit({isInEditMode: false, editId: ""})
        }

        data.addBill(newBill)
        resetForm()
    }

    function populateForm(billId: string){
        const bill = data.bills.get(billId)
        if(!bill) throw new Error("No bills found with id: " + billId)

        setWholeForm({
            ...form, 
            selectedSourceItem: sourceItems.find(i => i.data! == bill.billData.sourceBucketId)!,
            name: bill.billData.name,
            amount: bill.billData.amount.toString(),
            date: Util.formatDate(new Date(bill.billData.nextIncurralDate)),
            selectedFrequencyItem: frequencyItems.find(i => i.name.toLowerCase() == bill.billData.frequency.toLowerCase())!
        })
    }   

    return (
     
        <div className="outline-1 bg-panel1 outline-border rounded-md p-4 flex flex-col gap-4">
            <h1 className="text-title text-lg font-medium ">
                Create Bill
            </h1>
            <div className="flex flex-col w-full justify-between gap-4 sm:flex-row">
                 <div className="flex flex-col gap-1.5 w-full">
                    <p className="text-xs font-medium text-subtext1 relative ">
                        Source
                    </p>
                    <Select
                        items={sourceItems}
                        selectedItem={form.selectedSourceItem}
                        setSelectedItem={(id) => setForm("selectedSourceItem", sourceItems[id])}
                        showIcon={true}
                        center={true}
                        defaultText="Select Source"
                    />
                </div>
                <TextBoxLimited 
                    name="Name"
                    charLimit={15}
                    value={form.name}
                    setValue={value => setForm("name", value)}
                    placeHolder="e.g Insurance"
                    outerDivStyles="min-w-30"/>
                <TextBoxLimited 
                    name="Amount"
                    charLimit={10}
                    numeric={true}
                    value={form.amount}
                    setValue={value => setForm("amount", value)}
                    placeHolder="1200"
                    outerDivStyles="min-w-20"/>
                <div className="flex flex-col gap-1.5 w-full">
                    <p className="font-medium text-subtext1 relative text-xs whitespace-nowrap">
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
                        items={frequencyItems}
                        selectedItem={form.selectedFrequencyItem}
                        setSelectedItem={(id) => setForm("selectedFrequencyItem", frequencyItems[id])}
                        showIcon={true}
                        center={true}
                    />
                </div>
            </div>
            <div className="flex w-full gap-7 items-end justify-end">
                <Button 
                    name={edit.isInEditMode ? "Save" : "Add"}
                    icon={edit.isInEditMode ? <FaSave size={12}/> : <FaPlus size={12}/>}
                    onSubmit={() => addBill()}
                    highlight={false}
                    style="w-full flex gap-1.5 items-center"/>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
                {Array.from(data.bills.values()).map(bill => {
                    return(
                        <BillCard bill={bill} setEdit={() => {
                            setEdit({isInEditMode: true, editId: bill.billData.id!})
                            populateForm(bill.billData.id!)
                        }}/>
                    )
                })}
            </div>
        </div>
    )
}
