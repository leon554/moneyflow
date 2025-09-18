import Income from "@/components/creation/Income";



export default function Home() {

    return (
        <div className="mt-20 gap-5 m-auto flex flex-col items-center justify-center w-[95%] max-w-[700px]">
            <h1 className="text-title font-medium text-3xl w-full">
                Setup Buckets
            </h1>
            <hr className="text-border border-t w-full"/>
            <div className="text-sm w-full flex flex-col gap-3">
                <Income/>
            </div>
        
        </div>
    )
}
