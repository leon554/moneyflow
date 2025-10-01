import Button from "@/components/primitives/Button";
import DateInput from "@/components/primitives/DateInput";
import Select, { type dataFormat } from "@/components/primitives/Select";
import TextBoxLimited from "@/components/primitives/TextboxLimited";
import { dataContext } from "@/providers/DataProvider";
import { Bucket } from "@/Util/classes/Bucket";
import { AccountType, IncurralFrequency, type BucketDataType, type DeptAccount, type SavingsAccount, type Source } from "@/Util/types";
import { Util } from "@/Util/util";
import { useContext, useEffect, useState } from "react";
import BucketCard from "../cards/BucketCard";
import CreateSourceForm from "./CreateSourceForm";
import { FaPlus } from "react-icons/fa";
import { FaSave } from "react-icons/fa";
import useForm from "@/hooks/useForm";


export default function CreateBucket() {
    const data = useContext(dataContext)
    
    const accountTypeItems = Object.values(AccountType).map((v,i) => ({id: i, name: v.toString()}))

    const {form, setForm, setWholeForm, resetForm} = useForm({
        name: "",
        initialBalance: "",
        goalBalance: "",
        interest: "",
        compoundDate: Util.formatDate(new Date()),
        sources: [] as Source[],
        selectedAccountTypeItem: accountTypeItems[0] as dataFormat,
        selectedIncurralItem: Util.frequencyItems[0] as dataFormat
    })

    const [editData, setEditData] = useState({isEditing: false, bucketId: ""})
    const [modifiedBucket, setModifiedBucket] = useState(false)

    useEffect(() => {
        if(!editData.isEditing) return
        setFormFromExistingBucket(editData.bucketId)
    }, [editData])


    function addBucket(){
        if(!isValidForm()) return

        let newBucket: BucketDataType = {
            name: form.name,
            balance: Number(form.initialBalance),
            startBalance: Number(form.initialBalance),
            targetBalance: Number(form.goalBalance),
            sources: form.sources,
            accountType: AccountType.CashAccount
        }

        if(editData.isEditing){
            newBucket.id = data.buckets.get(editData.bucketId)!.bucket.id!
            newBucket.sources = form.sources.map(s => ({...s, bucketTargetId: newBucket.id!}))
        }

        if(form.selectedAccountTypeItem.name != AccountType.CashAccount){
            newBucket= {
                ...newBucket,
                accountType: form.selectedAccountTypeItem.name as AccountType.DeptAccount | AccountType.SavingsAccount,
                interest: Number(form.interest),
                compoundFrequency: form.selectedIncurralItem.name as IncurralFrequency,
                nextIncurralDate: Util.stringToDate(form.compoundDate).toISOString()
            }
        }

        data.addBucket(new Bucket(newBucket, data.incomeSources))
        setModifiedBucket(!modifiedBucket)
        setEditData({isEditing: false, bucketId: ""})
        resetForm()
    }


    
    function setFormFromExistingBucket(bucketId: string){
        const bucket = data.buckets.get(bucketId)
        if(!bucket) {throw new Error("Bucket is not found when trying to set form from existing bucket");}
        
        const formData: typeof form = {
            ...form,
            sources: [...bucket.bucket.sources],
            name: bucket.bucket.name,
            initialBalance: bucket.bucket.balance.toString(),
            goalBalance: bucket.bucket.targetBalance.toString(),
            selectedAccountTypeItem: accountTypeItems.find(a => a.name.toLowerCase() == bucket.bucket.accountType.toLowerCase())!
        }
        
        if(bucket.bucket.accountType != AccountType.CashAccount){
            formData.interest = bucket.bucket.interest.toString()
            formData.compoundDate = Util.formatDate(new Date(bucket.bucket.nextIncurralDate))
            formData.selectedIncurralItem = Util.frequencyItems.find(i => i.name.toLowerCase() == (bucket.bucket as SavingsAccount | DeptAccount).compoundFrequency.toLowerCase())!
        }
        setWholeForm(formData)
    }
    
    function isValidForm(){
        if(form.name == "" || form.goalBalance == "" || form.initialBalance == "") {alert("fill in all fields"); return false}
        if(Number(form.interest) > 100 || Number(form.interest) < 0) {alert("interest needs to be between 0 and 100"); return false}
        if(form.sources.length == 0) {alert("Create at least one source that will flow into this bucket"); return false}
        if(Number(form.goalBalance) < Number(form.initialBalance))  {alert("Goal value can't be less than starting value"); return false}
        return true
    }

    return (
     
        <div className="outline-1 bg-panel1 outline-border rounded-md p-4 flex flex-col">
            <h1 className="text-title text-lg font-medium mb-4">
                Add Bucket
            </h1>
            <CreateSourceForm sources={form.sources} setSources={(sources: Source[]) => setForm("sources", sources)} modifiedBucket={modifiedBucket}/>
            <div className="flex flex-col gap-4 pt-4">
                <h1 className="text-title  font-medium ">
                    Add Bucket Details
                </h1>
                {form.sources.length != 0 ?
                <>
                    <div className="flex flex-col w-full gap-4 sm:flex-row">
                        <TextBoxLimited 
                            name="Name"
                            charLimit={15}
                            value={form.name}
                            setValue={name => setForm("name", name)}
                            placeHolder="e.g Holiday"
                            outerDivStyles="w-full sm:min-w-25"
                            />
                        <TextBoxLimited 
                            name="Starting Value"
                            charLimit={10}
                            numeric={true}
                            value={form.initialBalance}
                            setValue={value => setForm("initialBalance", value)}
                            placeHolder="1200"
                            outerDivStyles="w-full sm:min-w-25"
                            negative={true}/>
                        <TextBoxLimited 
                            name="Goal Value"
                            charLimit={10}
                            numeric={true}
                            value={form.goalBalance}
                            setValue={value => setForm("goalBalance", value)}
                            placeHolder="1200"
                            outerDivStyles="w-full sm:min-w-25"
                            negative={true}/>
                        <div className="flex gap-4">
                            <div className="flex flex-col gap-1.5 w-full sm:w-fit">
                                <p className="text-xs font-medium text-subtext1 relative whitespace-nowrap">
                                    Account Type
                                </p>
                                <Select
                                    items={accountTypeItems}
                                    selectedItem={form.selectedAccountTypeItem}
                                    setSelectedItem={(id) => setForm("selectedAccountTypeItem", accountTypeItems[id])}
                                    showIcon={true}
                                    center={true}
                                    divStyles="sm:w-fit sm:min-w-[80px]"
                                />
                            </div>
                        </div>
                    </div>
                    {form.selectedAccountTypeItem.name != AccountType.CashAccount ? 
                        <div className="flex flex-col w-full gap-4 sm:flex-row">
                            <TextBoxLimited 
                                name="Yearly Interest Rate (%)"
                                charLimit={10}
                                numeric={true}
                                value={form.interest}
                                setValue={value => setForm("interest", value)}
                                placeHolder="4.8"
                                outerDivStyles="sm:w-[40%]"
                                invalidFunc={(v: string) => Number(v) > 100 || Number(v) < 0}/>
                            <div className="flex flex-col gap-1.5 w-full">
                                <p className="font-medium text-subtext1 relative text-xs">
                                    Next Compound Date
                                </p>
                                <DateInput
                                    date={form.compoundDate}
                                    setDate={value => setForm("compoundDate", value)}
                                    />
                            </div>
                            <div className="flex flex-col gap-1.5 ">
                                <p className="text-xs font-medium text-subtext1 relative whitespace-nowrap">
                                    Compound
                                </p>
                                <Select
                                    items={Util.frequencyItems}
                                    selectedItem={form.selectedIncurralItem}
                                    setSelectedItem={(id) => setForm("selectedIncurralItem", Util.frequencyItems[id])}
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
                        name={!editData.isEditing ? "Add Bucket" : "Update Bucket"}
                        onSubmit={addBucket}
                        highlight={false}
                        style="w-full flex gap-1.5 items-center"
                        icon={!editData.isEditing ? <FaPlus size={12}/> : <FaSave size={12}/>}/>
                </div>
                <div className="grid sm:grid-cols-2 gap-3 ">
                    {Array.from(data.buckets.values()).map(b => {
                        return(
                           <BucketCard bucket={b} setEdit={() => {
                                setEditData({isEditing: true, bucketId: b.bucket.id!})
                            }}/>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

