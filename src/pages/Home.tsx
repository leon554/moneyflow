import AddSystemFirst from "@/components/creation/AddSystemFirst";
import CreateBill from "@/components/creation/CreateBill";
import CreateBucket from "@/components/creation/CreateBucket";
import CreateIncomeSource from "@/components/creation/CreateIncomeSource";
import CreateSystem from "@/components/creation/CreateSystem";
import Button from "@/components/primitives/Button";
import useLocalStorage from "@/hooks/useLocalStorage";
import { dataContext } from "@/providers/DataProvider";
import { useContext } from "react";
import { FaAngleRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";


export default function Home() {

    const data = useContext(dataContext)
    const [pageIndex, setPageIndex] = useLocalStorage("pageIndex", -1)
    const hasSelectedSystem = data.selectedSystem != ""
    const navigate = useNavigate()

    return (
        <div className="h-screen bg-gradient-to-b from-neutral-900 to-emerald-900/15 texture"> 
            <div className="pt-20 gap-5 flex flex-col items-center justify-center w-[95%] max-w-[700px] m-auto">
                <h1 className="text-title font-medium text-3xl w-full">
                    New Budget System
                </h1>
                <hr className="text-border border-t w-full"/>
                <div className="flex flex-row w-full gap-2 items-center">
                    <p className={`text-sm whitespace-nowrap hover:cursor-pointer hover:text-highlight transition-all duration-150 ease-in-out ${pageIndex == -1 ? "underline text-highlight/70" : "text-subtext3 "} `}
                        onClick={() => setPageIndex(-1)}>
                        System Name 
                    </p>
                    <FaAngleRight className=" text-subtext3" size={12}/>
                    <p className={` text-sm whitespace-nowrap hover:cursor-pointer hover:text-highlight transition-all duration-150 ease-in-out ${pageIndex == 0 ? "underline text-highlight/70" : "text-subtext3 "} `}
                        onClick={() => setPageIndex(0)}>
                        Income Source 
                    </p>
                    <FaAngleRight className=" text-subtext3" size={12}/>
                    <p className={` text-sm whitespace-nowrap hover:cursor-pointer hover:text-highlight transition-all duration-150 ease-in-out ${pageIndex == 1 ? "underline text-highlight/70" : "text-subtext3 "} `}
                        onClick={() => setPageIndex(1)}>
                        Buckets
                    </p>
                    <FaAngleRight className=" text-subtext3" size={12}/>
                    <p className={` text-sm whitespace-nowrap hover:cursor-pointer hover:text-highlight transition-all duration-150 ease-in-out ${pageIndex == 2 ? "underline text-highlight/70" : "text-subtext3 "} `}
                        onClick={() => setPageIndex(2)}>
                        Bills
                    </p>
                </div>
                <div className="text-sm w-full flex flex-col gap-3 mb-15">
                    {pageIndex == 0?
                        <>
                            {hasSelectedSystem ? 
                                <CreateIncomeSource/> 
                                : <AddSystemFirst setPage={setPageIndex}/>
                            }
                            <div className="flex w-full justify-between mb-10 gap-3">
                                <Button
                                    name={"Previous"}
                                    icon={<FaAngleRight className="text-subtext2 sm:block hidden rotate-180 " size={0}/>}
                                    highlight={false}
                                    onSubmit={() => {setPageIndex(-1)}}
                                    style="gap-1.5 w-full"/>
                                <Button
                                    name={"Next"}
                                    highlight={false}
                                    icon={<FaAngleRight className="text-subtext2 sm:block hidden " size={0}/>}
                                    onSubmit={() => {setPageIndex(1)}}
                                    style="gap-1.5 w-full"
                                    rightSide={true}/>
                            </div>
                        </>:
                        pageIndex == 1 ?
                        <>
                            {hasSelectedSystem ? 
                            <CreateBucket/> 
                            : <AddSystemFirst setPage={setPageIndex}/>
                            }
                            <div className="flex w-full justify-between mb-10 gap-3">
                                <Button
                                    name={"Previous"}
                                    icon={<FaAngleRight className="text-subtext2 sm:block hidden rotate-180 " size={0}/>}
                                    highlight={false}
                                    onSubmit={() => {setPageIndex(0)}}
                                    style="gap-1.5 w-full"/>
                                <Button
                                    name={"Next"}
                                    highlight={false}
                                    icon={<FaAngleRight className="text-subtext2 sm:block hidden " size={0}/>}
                                    onSubmit={() => {setPageIndex(2)}}
                                    style="gap-1.5 w-full"
                                    rightSide={true}/>
                            </div>
                        </>:
                        pageIndex == 2 ?
                        <>
                            {hasSelectedSystem ? 
                                <CreateBill/> :
                                <AddSystemFirst setPage={setPageIndex}/>
                            }
                            <div className="flex w-full justify-between mb-10 gap-3">
                                <Button
                                    name={"Previous"}
                                    icon={<FaAngleRight className="text-subtext2 sm:block hidden rotate-180 " size={0}/>}
                                    highlight={false}
                                    onSubmit={() => {setPageIndex(1)}}
                                    style="gap-1.5 w-full"/>
                                <Button
                                    name={"Simulate Your System"}
                                    highlight={false}
                                    icon={<FaAngleRight className="text-subtext2 sm:block hidden " size={0}/>}
                                    onSubmit={() => {
                                        navigate("/simulate")
                                    }}
                                    style="gap-1.5 w-full"
                                    rightSide={true}/>
                            </div>
                        </>:
                        <>
                            <CreateSystem/>
                            <div className="flex w-full justify-end">
                                <Button
                                    name={"Next"}
                                    highlight={false}
                                    onSubmit={() => {setPageIndex(0)}}
                                    style="gap-1.5"
                                    icon={<FaAngleRight className="text-subtext2 sm:block hidden " size={0}/>}
                                    rightSide={true}/>
                            </div>
                        </>
                    }
                </div>
                
            </div>
        </div>
    )
}
