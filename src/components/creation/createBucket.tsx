import Button from "@/components/primitives/Button";
import DateInput from "@/components/primitives/DateInput";
import Select, { type dataFormat } from "@/components/primitives/Select";
import TextBoxLimited from "@/components/primitives/TextboxLimited";
import { dataContext } from "@/providers/DataProvider";
import { Bucket } from "@/Util/classes/IncomeSource";
import { AccountType, IncurralFrequency, type BucketType } from "@/Util/types";
import { Util } from "@/Util/util";
import { useContext, useState } from "react";
import { FaRegTrashAlt } from "react-icons/fa";

export default function CreateBucket() {
    const data = useContext(dataContext)

    const sourceItems = Array.from(data.incomeSources.values()).map((v,i) => ({id: i, name: v.name}))
    const accountItems = Object.values(AccountType).map((v,i) => ({id: i, name: v.toString()}))
    const typeItems = [{id: 0, name: "%"}, {id: 1, name: "$"}]
    const incurralItems = Object.values(IncurralFrequency).map((v,i) => ({id: i - 1, name: v.slice(0,1).toUpperCase() + v.slice(1)})).filter(i => i.name != "OneTime")

    const [selectedSourceItem, setSelectedSourceItem] = useState<dataFormat>(sourceItems[0])
    const [selectedTypeItem, setSelectedTypeItem] = useState<dataFormat>(typeItems[0])
    const [selectedAccountItem, setSelectedAccountItem] = useState<dataFormat>(accountItems[0])
    const [selectedIncurralItem, setSelectedIncurralItem] = useState<dataFormat>(incurralItems[0])

    const [name, setName] = useState("")
    const [amount, setAmount] = useState("")
    const [startingValue, setStartingValue] = useState("")
    const [goal, setGoal] = useState("")
    const [interest, setInterest] = useState("")
    const [date, setDate] = useState(Util.formatDate(new Date()))


    function addIncome(){
        if(!selectedSourceItem) {alert("Select or create a source before creating this bucket"); return}
        if(name == "" || amount == "" || goal == "" || startingValue == "") {alert("fill in all fields"); return}
        if(Number(interest) > 100 || Number(interest) < 0) {alert("interest needs to be between 0 and 100")}

        let bucket: BucketType = {
            name,
            allocation: Number(amount),
            percentageAllocation: selectedTypeItem.name == "%",
            amount: Number(startingValue),
            target: Number(goal),
            sourceName: selectedSourceItem.name,
            accountType: AccountType.CashAccount
        }

        if(selectedAccountItem.name != AccountType.CashAccount){
            bucket= {
                ...bucket,
                accountType: selectedAccountItem.name as AccountType.DeptAccount | AccountType.SavingsAccount,
                interest: Number(interest),
                compoundFrequency: selectedIncurralItem.name as IncurralFrequency,
                nextIncurralDate: Util.stringToDate(date)
            }
        }
        data.addBucket(new Bucket(bucket, data.incomeSources))
        
    }

    return (
     
        <div className="outline-1 bg-panel1 outline-border rounded-md p-4 flex flex-col gap-4">
            <h1 className="text-title text-lg font-medium ">
                Add Bucket
            </h1>
            <div className="flex flex-col w-full justify-between gap-4 sm:flex-row">
                <TextBoxLimited 
                    name="Name"
                    charLimit={15}
                    value={name}
                    setValue={setName}
                    placeHolder="e.g Holiday"
                    outerDivStyles="sm:w-[30%]"
                    />
                <div className="flex gap-4 w-full ">
                    <TextBoxLimited 
                        name="Allocation Amount"
                        charLimit={10}
                        numeric={true}
                        value={amount}
                        setValue={setAmount}
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
            </div>
            <div className="flex flex-col w-full gap-4 sm:flex-row">
                <TextBoxLimited 
                    name="Starting Value"
                    charLimit={10}
                    numeric={true}
                    value={startingValue}
                    setValue={setStartingValue}
                    placeHolder="1200"
                    outerDivStyles="sm:w-[40%]"/>
                <TextBoxLimited 
                    name="Goal Value"
                    charLimit={10}
                    numeric={true}
                    value={goal}
                    setValue={setGoal}
                    placeHolder="1200"
                    outerDivStyles="w-full"/>
                <div className="flex gap-4">
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
            <div className="flex flex-col w-full gap-4 sm:flex-row">
                {selectedAccountItem.name != AccountType.CashAccount ? 
                <>
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
                </> : null}
            </div>
            <div className="flex w-full gap-7 items-end justify-end">
                <Button 
                    name="Add"
                    onSubmit={() => addIncome()}
                    highlight={true}
                    style="w-full"/>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
                {Array.from(data.buckets.values()).map(b => {
                    return(
                        <div className="w-full bg-panel2 p-2 rounded-md text-subtext1 outline-1 outline-border2 flex justify-between items-center px-3">
                            <div className=" flex flex-col gap-1.5">
                                <div className="flex  gap-2 items-center">
                                    <p className="text-title">
                                        {Util.capFirst(b.bucket.name)}
                                    </p>
                                    <p className="text-xs bg-btn text-btn-text px-1 rounded-full font-medium  py-[1px]">
                                        {b.bucket.percentageAllocation ? `${b.bucket.allocation}%` : `$${b.bucket.allocation}`}
                                    </p>
                                     <p className="text-xs bg-btn text-btn-text px-1  py-[1px] rounded-full font-medium">
                                        {b.bucket.accountType}
                                    </p>
                                </div>
                                <div className="text-xs flex gap-1 text-subtext2">
                                    <p>
                                        Taken from "{b.bucket.sourceName}"
                                    </p>
                                    {b.bucket.accountType == AccountType.DeptAccount ? 
                                    <p>
                                        paying {b.bucket.interest}% interest
                                    </p> :
                                    b.bucket.accountType == AccountType.SavingsAccount ? 
                                    <p>
                                        earning {b.bucket.interest}% interest
                                    </p> : null}
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

