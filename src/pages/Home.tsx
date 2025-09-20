import CreateBucket from "@/components/creation/createBucket";
import Income from "@/components/creation/Income";
import Button from "@/components/primitives/Button";
import useLocalStorage from "@/hooks/useLocalStorage";
import { FaAngleRight } from "react-icons/fa";


export default function Home() {

    const [pageIndex, setPageIndex] = useLocalStorage("pageIndex", 0)

    return (
        <div className="mt-20 gap-5 m-auto flex flex-col items-center justify-center w-[95%] max-w-[700px]">
            <h1 className="text-title font-medium text-3xl w-full">
                Create System
            </h1>
            <hr className="text-border border-t w-full"/>
            <div className="flex sm:flex-row flex-col w-full gap-4 items-center">
                <Button
                    name={"Add Income Sources"}
                    highlight={pageIndex == 0}
                    onSubmit={() => {setPageIndex(0)}}
                    style="w-full"/>
                <FaAngleRight className="text-highlight sm:block hidden " size={30}/>
                <Button
                    name={"Add Buckets"}
                    highlight={pageIndex == 1}
                    onSubmit={() => {setPageIndex(1)}}
                    style="w-full"/>
                <FaAngleRight className="text-highlight sm:block hidden" size={30}/>
                <Button
                    name={"Add Bills"}
                    highlight={pageIndex == 2}
                    onSubmit={() => {setPageIndex(2)}}
                    style="w-full"/>
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
                        <div className="flex w-full justify-between">
                            <Button
                                name={"Previous"}
                                icon={<FaAngleRight className="text-subtext2 sm:block hidden rotate-180 " size={0}/>}
                                highlight={false}
                                onSubmit={() => {setPageIndex(0)}}
                                style="gap-1.5"/>
                            <Button
                                name={"Next"}
                                highlight={false}
                                icon={<FaAngleRight className="text-subtext2 sm:block hidden " size={0}/>}
                                onSubmit={() => {setPageIndex(2)}}
                                style="gap-1.5"
                                rightSide={true}/>
                        </div>
                    </>
                    :
                    null
                }
            </div>
        
        </div>
    )
}
