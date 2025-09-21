import Button from "@/components/primitives/Button";
import DateInput from "@/components/primitives/DateInput";
import Select, { type dataFormat } from "@/components/primitives/Select";
import TextBoxLimited from "@/components/primitives/TextboxLimited";
import { dataContext } from "@/providers/DataProvider";
import { Bucket } from "@/Util/classes/Bucket";
import { AccountType, IncurralFrequency, type BucketDataType, type Source } from "@/Util/types";
import { Util } from "@/Util/util";
import { useContext, useState } from "react";
import BucketCard from "../display/BucketCard";
import SourceForm from "./SourceForm";
import useLocalStorage from "@/hooks/useLocalStorage";

export default function CreateBucket() {
    const data = useContext(dataContext)
    
    const accountItems = Object.values(AccountType).map((v,i) => ({id: i, name: v.toString()}))
    const incurralItems = Object.values(IncurralFrequency).map((v,i) => ({id: i, name: v.slice(0,1).toUpperCase() + v.slice(1)})).filter(i => i.name != "OneTime")


    const [selectedAccountItem, setSelectedAccountItem] = useState<dataFormat>(accountItems[0])
    const [selectedIncurralItem, setSelectedIncurralItem] = useState<dataFormat>(incurralItems[0])

    const [name, setName] = useState("")
    const [startingValue, setStartingValue] = useState("")
    const [goal, setGoal] = useState("")
    const [interest, setInterest] = useState("")
    const [date, setDate] = useState(Util.formatDate(new Date()))
    const [sources, setSources] = useLocalStorage<Source[]>("sources", [])
    const [selectedBucket, setSelectedBucket] = useState("")


    function addBucket(){
        if(name == "" || goal == "" || startingValue == "") {alert("fill in all fields"); return}
        if(Number(interest) > 100 || Number(interest) < 0) {alert("interest needs to be between 0 and 100")}
        if(sources.length == 0) {alert("Create at least one source that will flow into this bucket"); return}
        if(Number(goal) < Number(startingValue))  {alert("Goal value can't be less than starting value"); return}

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
        resetFormValues()
    }
    function updateBucket(){
        if(sources.length == 0) {alert("Create at least one source that will flow into this bucket"); return}
        data.addSourcesToBucket(selectedBucket, sources)
        resetFormValues()
    }
    function resetFormValues(){
        setSources([])
        setName("")
        setStartingValue("")
        setGoal("")
        setInterest("")
        setDate(Util.formatDate(new Date()))
    }

    return (
     
        <div className="outline-1 bg-panel1 outline-border rounded-md p-4 flex flex-col">
            <h1 className="text-title text-lg font-medium mb-4">
                Add Bucket
            </h1>
            <SourceForm sources={sources} setSources={setSources}/>
            <div className="flex flex-col gap-4 pt-4">
                <h1 className="text-title  font-medium ">
                    Add Bucket Details
                </h1>
                {selectedBucket == "" && sources.length != 0?
                <>
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
                            outerDivStyles="w-full sm:min-w-25"
                            negative={true}/>
                        <TextBoxLimited 
                            name="Goal Value"
                            charLimit={10}
                            numeric={true}
                            value={goal}
                            setValue={setGoal}
                            placeHolder="1200"
                            outerDivStyles="w-full sm:min-w-25"
                            negative={true}/>
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
                </>
                : 
                sources.length == 0 ? 
                    <div>
                        <div className="text-subtext2 text-xs flex  items-end mb-[8px]">
                            Create a source above first. Sources specifies what income goes towards this bucket add or choose and existing acount
                        </div>
                    </div> :
                    <div>
                        <div className="text-subtext2 text-xs flex  items-end mb-[8px]">
                           To create new bucket, deselect existing selected bucket below.
                        </div>
                    </div> 
                }
                {data.buckets.size != 0 && sources.length != 0?
                <>
                    <div className="flex items-center gap-2">
                        <hr className="text-border border-t w-full"/>
                        <p className="text-subtext3 text-xs font-medium">
                            OR
                        </p>
                        <hr className="text-border border-t w-full"/>
                    </div>
                    <h1 className="text-title  font-medium leading-none">
                        Select Existing Bucket
                    </h1>
                    <div className="sm:flex sm:flex-row flex-wrap  w-full gap-4 max-sm:grid max-sm:grid-cols-2">
                        {Array.from(data.buckets.values()).map(b => {
                            return(
                                <Button
                                    name={b.bucket.name}
                                    highlight={selectedBucket == b.bucket.name}
                                    small={true}
                                    onSubmit={() =>  setSelectedBucket((selectedBucket == b.bucket.name) ? "" : b.bucket.name)}
                                    style="flex-1"/>
                            )
                        })}
                    </div> 
                    <hr className="text-border border-t w-full mt-1 mb-1"/>
                </> : null}
                <div className="flex w-full gap-7 items-end justify-end">
                    <Button 
                        name={selectedBucket == "" ? "Add Bucket" : "Update Button"}
                        onSubmit={() => selectedBucket == "" ? addBucket() : updateBucket()}
                        highlight={false}
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

