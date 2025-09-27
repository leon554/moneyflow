import Button from "@/components/primitives/Button";
import DateInput from "@/components/primitives/DateInput";
import Select, { type dataFormat } from "@/components/primitives/Select";
import TextBoxLimited from "@/components/primitives/TextboxLimited";
import { dataContext } from "@/providers/DataProvider";
import { Bucket } from "@/Util/classes/Bucket";
import { AccountType, IncurralFrequency, type BucketDataType, type DeptAccount, type SavingsAccount, type Source } from "@/Util/types";
import { Util } from "@/Util/util";
import { useContext, useEffect, useState } from "react";
import BucketCard from "../display/BucketCard";
import SourceForm from "./SourceForm";
import { FaPlus } from "react-icons/fa";
import { FaSave } from "react-icons/fa";


export default function CreateBucket() {
    const data = useContext(dataContext)
    
    const accountItems = Object.values(AccountType).map((v,i) => ({id: i, name: v.toString()}))
    const incurralItems = Object.values(IncurralFrequency).map((v,i) => ({id: i - 1, name: v.slice(0,1).toUpperCase() + v.slice(1)})).filter(i => i.name != "Onetime")


    const [selectedAccountItem, setSelectedAccountItem] = useState<dataFormat>(accountItems[0])
    const [selectedIncurralItem, setSelectedIncurralItem] = useState<dataFormat>(incurralItems[0])

    const [name, setName] = useState("")
    const [startingValue, setStartingValue] = useState("")
    const [goal, setGoal] = useState("")
    const [interest, setInterest] = useState("")
    const [compoundDate, setCompoundDate] = useState(Util.formatDate(new Date()))
    const [sources, setSources] = useState<Source[]>([])

    const [editBucket, setEditBucket] = useState(false)
    const [selectedEditBucketId, setSelectedEditBucketId] = useState("")
    const [modifiedBucket, setModifiedBucket] = useState(false)

    useEffect(() => {
        if(!editBucket) return
        setFormFromExistingBucket(selectedEditBucketId)
        setEditBucket(false)
    }, [editBucket])


    function addBucket(){
        if(name == "" || goal == "" || startingValue == "") {alert("fill in all fields"); return}
        if(Number(interest) > 100 || Number(interest) < 0) {alert("interest needs to be between 0 and 100")}
        if(sources.length == 0) {alert("Create at least one source that will flow into this bucket"); return}
        if(Number(goal) < Number(startingValue))  {alert("Goal value can't be less than starting value"); return}

        let bucket: BucketDataType = {
            name,
            balance: Number(startingValue),
            targetBalance: Number(goal),
            sources: sources,
            accountType: AccountType.CashAccount
        }
        if(selectedEditBucketId != ""){
            bucket.id = data.buckets.get(selectedEditBucketId)!.bucket.id!
            setSelectedEditBucketId("")
        }

        if(selectedAccountItem.name != AccountType.CashAccount){
            bucket= {
                ...bucket,
                accountType: selectedAccountItem.name as AccountType.DeptAccount | AccountType.SavingsAccount,
                interest: Number(interest),
                compoundFrequency: selectedIncurralItem.name as IncurralFrequency,
                nextIncurralDate: Util.stringToDate(compoundDate).toISOString()
            }
        }
        data.addBucket(new Bucket(bucket, data.incomeSources))
        setModifiedBucket(!modifiedBucket)
        resetFormValues()
    }


    function resetFormValues(){
        setSources([])
        setName("")
        setStartingValue("")
        setGoal("")
        setInterest("")
        setCompoundDate(Util.formatDate(new Date()))
    }

    function setFormFromExistingBucket(bucketId: string){
        const bucket = data.buckets.get(bucketId)
        if(!bucket) {throw new Error("Bucket is not found when trying to set form from existing bucket");}

        setSources([...bucket.bucket.sources])
        setName(bucket.bucket.name)
        setStartingValue(bucket.bucket.balance.toString())
        setGoal(bucket.bucket.targetBalance.toString())
        setSelectedAccountItem(accountItems.find(a => a.name.toLowerCase() == bucket.bucket.accountType.toLowerCase())!)

        if(bucket.bucket.accountType != AccountType.CashAccount){
            setInterest(bucket.bucket.interest.toString())
            setCompoundDate(Util.formatDate(new Date(bucket.bucket.nextIncurralDate)))
            setSelectedIncurralItem(incurralItems.find(i => i.name.toLowerCase() == (bucket.bucket as SavingsAccount | DeptAccount).compoundFrequency.toLowerCase())!)
        }
    }

    return (
     
        <div className="outline-1 bg-panel1 outline-border rounded-md p-4 flex flex-col">
            <h1 className="text-title text-lg font-medium mb-4">
                Add Bucket
            </h1>
            <SourceForm sources={sources} setSources={setSources} modifiedBucket={modifiedBucket}/>
            <div className="flex flex-col gap-4 pt-4">
                <h1 className="text-title  font-medium ">
                    Add Bucket Details
                </h1>
                {sources.length != 0 ?
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
                                    date={compoundDate}
                                    setDate={setCompoundDate}
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
                <div>
                    <div className="text-subtext2 text-xs flex  items-end mb-[8px]">
                        Create a source above first. Sources specifies what income goes towards this bucket add or choose and existing acount
                    </div>
                </div>
                }
                <hr className="text-border border-t w-full mt-1 mb-1"/>
                <div className="flex w-full gap-7 items-end justify-end">
                    <Button 
                        name={selectedEditBucketId == "" ? "Add Bucket" : "Update Bucket"}
                        onSubmit={addBucket}
                        highlight={false}
                        style="w-full flex gap-1.5 items-center"
                        icon={selectedEditBucketId == "" ? <FaPlus size={12}/> : <FaSave size={12}/>}/>
                </div>
                <div className="grid sm:grid-cols-2 gap-3 ">
                    {Array.from(data.buckets.values()).map(b => {
                        return(
                           <BucketCard bucket={b} setEdit={() => {
                                setSelectedEditBucketId(b.bucket.id!)
                                setEditBucket(true)
                            }}/>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

