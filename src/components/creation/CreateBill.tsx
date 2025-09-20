import Button from "@/components/primitives/Button";
import DateInput from "@/components/primitives/DateInput";
import Select, { type dataFormat } from "@/components/primitives/Select";
import TextBoxLimited from "@/components/primitives/TextboxLimited";
import { dataContext } from "@/providers/DataProvider";
import { IncurralFrequency, type BillData} from "@/Util/types";
import { Util } from "@/Util/util";
import { useContext, useState } from "react";
import BillCard from "../display/BillCard";
import { Bill } from "@/Util/classes/Bill";

export default function CreateBill() {

    const data = useContext(dataContext)

    const frequencyItems = Object.values(IncurralFrequency).map((v,i) => ({id: i, name: Util.capFirst(v)}))
    const sourceItems = Array.from(data.buckets.values()).map((b,i) => ({id: i, name: Util.capFirst(b.bucket.name)}))
    
    const [name, setName] = useState("")
    const [amount, setAmount] = useState("")
    const [date, setDate] = useState(Util.formatDate(new Date()))
    const [selectedFrequencyItem, setSelectedFrequencyItem] = useState<dataFormat>(frequencyItems[0])
    const [selectedSourceItem, setSelectedSourceItem] = useState<dataFormat|null>(null)


    function addBill(){
        if(name == "" || amount == "" || date == "") {alert("fill in all fields"); return}
        if(!selectedSourceItem) {alert("Select or create a bucket source first"); return}

        const billData: BillData= {
            name,
            sourceBucketName: selectedSourceItem.name,
            amount: Number(amount),
            balance: 0,
            frequency: selectedFrequencyItem.name.toLowerCase() as IncurralFrequency,
            nextIncurralDate: Util.stringToDate(date).toISOString()
        }

        data.addBill(new Bill(billData))
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
                        selectedItem={selectedSourceItem}
                        setSelectedItem={(id) => setSelectedSourceItem(sourceItems[id])}
                        showIcon={true}
                        center={true}
                        defaultText="Select Source"
                    />
                </div>
                <TextBoxLimited 
                    name="Name"
                    charLimit={15}
                    value={name}
                    setValue={setName}
                    placeHolder="e.g Insurance"
                    outerDivStyles="min-w-30"/>
                <TextBoxLimited 
                    name="Amount"
                    charLimit={10}
                    numeric={true}
                    value={amount}
                    setValue={setAmount}
                    placeHolder="1200"
                    outerDivStyles="min-w-20"/>
                <div className="flex flex-col gap-1.5 w-full">
                    <p className="font-medium text-subtext1 relative text-xs whitespace-nowrap">
                        Next Payment
                    </p>
                    <DateInput
                        date={date}
                        setDate={setDate}
                        />
                </div>
                <div className="flex flex-col gap-1.5 w-full">
                    <p className="text-xs font-medium text-subtext1 relative ">
                        Frequency
                    </p>
                    <Select
                        items={frequencyItems}
                        selectedItem={selectedFrequencyItem}
                        setSelectedItem={(id) => setSelectedFrequencyItem(frequencyItems[id])}
                        showIcon={true}
                        center={true}
                    />
                </div>
            </div>
            <div className="flex w-full gap-7 items-end justify-end">
                <Button 
                    name="Add"
                    onSubmit={() => addBill()}
                    highlight={false}
                    style="w-full"/>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
                {Array.from(data.bills.values()).map(bill => {
                    return(
                       <BillCard bill={bill}/>
                    )
                })}
            </div>
        </div>
    )
}
