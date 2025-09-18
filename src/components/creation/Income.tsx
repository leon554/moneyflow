import Button from "@/components/primitives/Button";
import DateInput from "@/components/primitives/DateInput";
import Select, { type dataFormat } from "@/components/primitives/Select";
import TextBoxLimited from "@/components/primitives/TextboxLimited";
import { dataContext } from "@/providers/DataProvider";
import { IncomeSource } from "@/Util/classes/IncomeSource";
import { IncurralFrequency, type IncomeDataType } from "@/Util/types";
import { Util } from "@/Util/util";
import { useContext, useState } from "react";
import { FaRegTrashAlt } from "react-icons/fa";

export default function Income() {

    const items = Object.values(IncurralFrequency).map((v,i) => ({id: i, name: v.slice(0,1).toUpperCase() + v.slice(1)}))
    const [name, setName] = useState("")
    const [amount, setAmount] = useState("")
    const [date, setDate] = useState(Util.formatDate(new Date()))
    const [selectedItem, setSelectedItem] = useState<dataFormat>(items[0])

    const data = useContext(dataContext)

    function addIncome(){
        if(name == "" || amount == "" || date == "") {alert("fill in all fields"); return}
        const sourceData: IncomeDataType = {
            name,
            incomeAmount: Number(amount),
            incomeFrequency: selectedItem.name.toLowerCase() as IncurralFrequency,
            nextIncurralData: Util.stringToDate(date).toISOString()
        }
        data.addIncomeSource(new IncomeSource(sourceData))
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
                    value={name}
                    setValue={setName}
                    placeHolder="e.g Wage"
                    />
                <TextBoxLimited 
                    name="Amount"
                    charLimit={10}
                    numeric={true}
                    value={amount}
                    setValue={setAmount}
                    placeHolder="1200"/>
                <div className="flex flex-col gap-1.5 w-full">
                    <p className="font-medium text-subtext1 relative text-xs">
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
                        items={items}
                        selectedItem={selectedItem}
                        setSelectedItem={(id) => setSelectedItem(items[id])}
                        showIcon={true}
                        center={true}
                    />
                </div>
            </div>
            <div className="flex w-full gap-7 items-end justify-end">
                <Button 
                    name="Add"
                    onSubmit={() => addIncome()}
                    highlight={true}
                    style="w-full"/>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
                {Array.from(data.incomeSources.values()).map(v => {
                    return(
                        <div className="w-full bg-panel2 p-2 rounded-md text-subtext1 outline-1 outline-border2 flex justify-between items-center px-3">
                            <div className=" flex flex-col gap-1.5">
                                <div className="flex  gap-2 items-center">
                                    <p className="text-title">
                                        {Util.capFirst(v.sourceData.name)}
                                    </p>
                                    <p className="text-xs bg-btn text-btn-text px-1 rounded-full font-medium  py-[1px]">
                                        ${v.sourceData.incomeAmount}
                                    </p>
                                </div>
                                <div className="text-xs flex gap-1 text-subtext2">
                                    <p>
                                        Paid {v.sourceData.incomeFrequency}
                                    </p>
                                    <p>
                                        starting on {Util.formatDate(new Date(v.sourceData.nextIncurralData))}
                                    </p>
                                </div>
                            </div>
                            <div className="hover:cursor-pointer text-subtext2">
                                <FaRegTrashAlt className="hover:text-subtext1 transition-all duration-200 ease-in-out"/>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
