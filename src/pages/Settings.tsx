import ClearData from "@/components/settings/ClearData";
import Links from "@/components/settings/Links";

export default function Settings() {
    return (
        <div className="mt-16 m-auto max-w-[500px] w-[95%] flex flex-col gap-5">
            <h1 className="text-3xl text-title font-medium">
                Settings
            </h1>
             <hr className="text-border border-t w-full"/>
            <div className="flex flex-col gap-3">
                <ClearData/>
                <Links/>
            </div>
        </div>
    )
}
