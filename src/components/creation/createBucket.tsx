import Button from "@/components/primitives/Button";
import DateInput from "@/components/primitives/DateInput";
import Select, { type dataFormat } from "@/components/primitives/Select";
import TextBoxLimited from "@/components/primitives/TextboxLimited";
import { dataContext } from "@/providers/DataProvider";
import { Bucket } from "@/Util/classes/Bucket";
import { AccountType, IncurralFrequency, type BucketDataType, type Source } from "@/Util/types";
import { Util } from "@/Util/util";
import { useContext, useState } from "react";
import { FaRegTrashAlt } from "react-icons/fa";
import BucketCard from "../display/bucketCard";

export default function CreateBucket() {
    const data = useContext(dataContext)

    const sourceItems = Array.from(data.incomeSources.values()).map((v,i) => ({id: i, name: v.sourceData.name}))
    const accountItems = Object.values(AccountType).map((v,i) => ({id: i, name: v.toString()}))
    const typeItems = [{id: 0, name: "%"}, {id: 1, name: "$"}]
    const incurralItems = Object.values(IncurralFrequency).map((v,i) => ({id: i - 1, name: v.slice(0,1).toUpperCase() + v.slice(1)})).filter(i => i.name != "OneTime")

    const [selectedSourceItem, setSelectedSourceItem] = useState<dataFormat>(sourceItems[0])
    const [selectedTypeItem, setSelectedTypeItem] = useState<dataFormat>(typeItems[0])
    const [selectedAccountItem, setSelectedAccountItem] = useState<dataFormat>(accountItems[0])
    const [selectedIncurralItem, setSelectedIncurralItem] = useState<dataFormat>(incurralItems[0])

    const [name, setName] = useState("")
    const [allocation, setAllocation] = useState("")
    const [startingValue, setStartingValue] = useState("")
    const [goal, setGoal] = useState("")
    const [interest, setInterest] = useState("")
    const [date, setDate] = useState(Util.formatDate(new Date()))
    const [sources, setSources] = useState<Source[]>([])


    function addIncome(){
        if(!selectedSourceItem) {alert("Select or create a source before creating this bucket"); return}
        if(name == "" || goal == "" || startingValue == "") {alert("fill in all fields"); return}
        if(Number(interest) > 100 || Number(interest) < 0) {alert("interest needs to be between 0 and 100")}
        if(sources.length == 0) {alert("Create at least one source that will flow into this bucket"); return}

        let bucket: BucketDataType = {
            name,
            balance: Number(startingValue),
            targetBalance: Number(goal),
            sources: [...sources],
            accountType: AccountType.CashAccount
        }

        if(selectedAccountItem.name != AccountType.CashAccount){
            bucket= {
                ...bucket,
                accountType: selectedAccountItem.name as AccountType.DeptAccount | AccountType.SavingsAccount,
                interest: Number(interest),
                compoundFrequency: selectedIncurralItem.name as IncurralFrequency,
                nextIncurralDate: Util.stringToDate(date).toISOString()
            }
        }
        data.addBucket(new Bucket(bucket, data.incomeSources))
        setSources([])
        setName("")
        setStartingValue("")
        setGoal("")
        setInterest("")
        setDate(Util.formatDate(new Date()))
    }
    function addSource(){
        if(!selectedSourceItem) {alert("Select or create a source before creating this bucket"); return}
        if(allocation == "") {alert("Add allocation value"); return}
        if(selectedTypeItem.name == "%" && Number(allocation) > 100) {alert("can't have percentage higher than 100"); return}

        const newSource: Source = {
            sourceName: selectedSourceItem.name,
            allocation: Number(allocation),
            isPercentage: selectedTypeItem.name== "%"
        }
        setAllocation("");
        setSources([...sources, newSource])
    }

    return (
     
        <div className="outline-1 bg-panel1 outline-border rounded-md p-4 flex flex-col">
            <h1 className="text-title text-lg font-medium mb-4">
                Add Bucket
            </h1>
            <div className="flex flex-col gap-4 border-t border-b  border-border2 py-4 pb-6">
                <h1 className="text-title  font-medium">
                    Add Sources
                </h1>
                <div className="flex flex-col w-full justify-between gap-4 sm:flex-row">
                    <div className="flex flex-col gap-1.5 w-full sm:w-fit">
                        <p className="text-xs font-medium text-subtext1 relative ">
                            Source
                        </p>
                        <Select
                            items={sourceItems}
                            selectedItem={selectedSourceItem}
                            setSelectedItem={(id) => setSelectedSourceItem(sourceItems[id])}
                            showIcon={true}
                            center={true}
                            divStyles="sm:w-fit"
                        />
                    </div>
                    <TextBoxLimited 
                        name="Allocation Amount"
                        charLimit={10}
                        numeric={true}
                        value={allocation}
                        setValue={setAllocation}
                        placeHolder="1200"
                        outerDivStyles="w-full"/>
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
                </div>
                <Button 
                    name="Add Source"
                    onSubmit={() => addSource()}
                    highlight={true}
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
            <div className="flex flex-col gap-4 pt-4">
                <h1 className="text-title  font-medium ">
                    Add Bucket Details
                </h1>
                <div className="flex flex-col w-full gap-4 sm:flex-row">
                    <TextBoxLimited 
                        name="Name"
                        charLimit={15}
                        value={name}
                        setValue={setName}
                        placeHolder="e.g Holiday"
                        outerDivStyles="w-full sm:min-w-25"
                        />
                    <TextBoxLimited 
                        name="Starting Value"
                        charLimit={10}
                        numeric={true}
                        value={startingValue}
                        setValue={setStartingValue}
                        placeHolder="1200"
                        outerDivStyles="w-full sm:min-w-25"/>
                    <TextBoxLimited 
                        name="Goal Value"
                        charLimit={10}
                        numeric={true}
                        value={goal}
                        setValue={setGoal}
                        placeHolder="1200"
                        outerDivStyles="w-full sm:min-w-25"/>
                    <div className="flex gap-4">
                        <div className="flex flex-col gap-1.5 w-full sm:w-fit">
                            <p className="text-xs font-medium text-subtext1 relative whitespace-nowrap">
                                Account Type
                            </p>
                            <Select
                                items={accountItems}
                                selectedItem={selectedAccountItem}
                                setSelectedItem={(id) => setSelectedAccountItem(accountItems[id])}
                                showIcon={true}
                                center={true}
                                divStyles="sm:w-fit sm:min-w-[80px]"
                            />
                        </div>
                    </div>
                </div>
                {selectedAccountItem.name != AccountType.CashAccount ? 
                    <div className="flex flex-col w-full gap-4 sm:flex-row">
                        <TextBoxLimited 
                            name="Yearly Interest Rate (%)"
                            charLimit={10}
                            numeric={true}
                            value={interest}
                            setValue={setInterest}
                            placeHolder="4.8"
                            outerDivStyles="sm:w-[40%]"
                            invalidFunc={(v: string) => Number(v) > 100 || Number(v) < 0}/>
                        <div className="flex flex-col gap-1.5 w-full">
                            <p className="font-medium text-subtext1 relative text-xs">
                                Next Compound Date
                            </p>
                            <DateInput
                                date={date}
                                setDate={setDate}
                                />
                        </div>
                        <div className="flex flex-col gap-1.5 ">
                            <p className="text-xs font-medium text-subtext1 relative whitespace-nowrap">
                                Compound
                            </p>
                            <Select
                                items={incurralItems}
                                selectedItem={selectedIncurralItem}
                                setSelectedItem={(id) => setSelectedIncurralItem(incurralItems[id])}
                                showIcon={true}
                                center={true}
                                divStyles="sm:w-fit"
                            />
                        </div>
                </div> : null}
                <div className="flex w-full gap-7 items-end justify-end">
                    <Button 
                        name="Add"
                        onSubmit={() => addIncome()}
                        highlight={true}
                        style="w-full"/>
                </div>
                <div className="grid sm:grid-cols-2 gap-3 ">
                    {Array.from(data.buckets.values()).map(b => {
                        return(
                           <BucketCard bucket={b}/>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

