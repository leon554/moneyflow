import Button from "@/components/primitives/Button";
import DateInput from "@/components/primitives/DateInput";
import Select, { type dataFormat } from "@/components/primitives/Select";
import TextBoxLimited from "@/components/primitives/TextboxLimited";
import { useState } from "react";


export default function Home() {

    const items = [{id: 0, name: "Weekly"}, {id: 1, name: "Bi-Weekly"}, {id:2, name: "Monthly"}]
    const [name, setName] = useState("")
    const [date, setDate] = useState("")
    const [selectedItem, setSelectedItem] = useState<dataFormat>(items[0])

    return (
        <div className="mt-20 gap-5 m-auto flex flex-col items-center justify-center w-[95%] max-w-[700px]">
            <h1 className="text-title font-medium text-3xl w-full">
                Setup Buckets
            </h1>
            <hr className="text-border border-t w-full"/>
            <div className="text-sm w-full flex flex-col gap-3">
                <h1 className="text-subtext1 text-lg font-medium">
                    Income
                </h1>
                <div className="outline-1 bg-panel1 outline-border rounded-md p-4 flex flex-col gap-4">
                    <div className="flex w-full justify-between gap-7">
                        <TextBoxLimited 
                            name="Name"
                            charLimit={40}
                            value={name}
                            setValue={setName}
                            placeHolder="e.g Wage"
                            />
                        <TextBoxLimited 
                            name="Amount"
                            charLimit={40}
                            numeric={true}
                            value={name}
                            setValue={setName}
                            placeHolder="1200"/>
                    </div>
                    <div className="flex w-full gap-7">
                        <div className="flex flex-col gap-2 w-full">
                            <p className="text-sm font-medium text-subtext1 relative">
                                Next Payment Date
                            </p>
                            <DateInput
                                date={date}
                                setDate={setDate}/>
                        </div>
                        <div className="flex flex-col gap-2 w-full">
                            <p className="text-sm font-medium text-subtext1 relative">
                                Income Frequency
                            </p>
                            <Select
                                items={items}
                                selectedItem={selectedItem}
                                setSelectedItem={(id) => setSelectedItem(items[id])}
                                showIcon={true}
                            />
                        </div>
                    </div>
                    <Button 
                        name="Add"
                        onSubmit={() => alert("dsd")}
                        highlight={false}/>
                </div>
            </div>
        
        </div>
    )
}
