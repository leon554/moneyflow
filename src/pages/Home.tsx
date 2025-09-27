import CreateBill from "@/components/creation/CreateBill";
import CreateBucket from "@/components/creation/createBucket";
import Income from "@/components/creation/Income";
import Button from "@/components/primitives/Button";
import useLocalStorage from "@/hooks/useLocalStorage";
import { FaAngleRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";


export default function Home() {

    const [pageIndex, setPageIndex] = useLocalStorage("pageIndex", 0)
    const navigate = useNavigate()

    return (
        <div className="mt-20 gap-5 m-auto flex flex-col items-center justify-center w-[95%] max-w-[700px]">
            <h1 className="text-title font-medium text-3xl w-full">
                New Budget System
            </h1>
            <hr className="text-border border-t w-full"/>
            <div className="flex flex-row w-full gap-2 items-center">
                <p className={`text-subtext3 text-sm whitespace-nowrap hover:cursor-pointer hover:text-subtext2 transition-all duration-150 ease-in-out ${pageIndex == 0 ? "underline" : ""} `}
                    onClick={() => setPageIndex(0)}>
                    Income Source 
                </p>
                <FaAngleRight className=" text-subtext3" size={12}/>
                <p className={`text-subtext3 text-sm whitespace-nowrap hover:cursor-pointer hover:text-subtext2 transition-all duration-150 ease-in-out ${pageIndex == 1 ? "underline" : ""} `}
                    onClick={() => setPageIndex(1)}>
                    Income Source 
                </p>
                <FaAngleRight className=" text-subtext3" size={12}/>
                 <p className={`text-subtext3 text-sm whitespace-nowrap hover:cursor-pointer hover:text-subtext2 transition-all duration-150 ease-in-out ${pageIndex == 2 ? "underline" : ""} `}
                    onClick={() => setPageIndex(2)}>
                    Income Source 
                </p>
            </div>
            <div className="text-sm w-full flex flex-col gap-3 mb-15">
                {pageIndex == 0?
                    <>
                        <Income/> 
                        <div className="flex w-full justify-end">
                            <Button
                                name={"Next"}
                                highlight={false}
                                onSubmit={() => {setPageIndex(1)}}
                                style="gap-1.5"
                                icon={<FaAngleRight className="text-subtext2 sm:block hidden " size={0}/>}
                                rightSide={true}/>
                        </div>
                    </>:
                    pageIndex == 1 ?
                    <>
                        <CreateBucket/> 
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
                    </>
                    :
                    <>
                        <CreateBill/>
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
                                    setPageIndex(0)
                                    navigate("/simulate")
                                }}
                                style="gap-1.5 w-full"
                                rightSide={true}/>
                        </div>
                    </>
                }
            </div>
        
        </div>
    )
}
