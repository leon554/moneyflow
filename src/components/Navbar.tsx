import { dataContext } from "@/providers/DataProvider"
import { useContext } from "react"
import { Link } from "react-router-dom"
import { IoSettingsSharp } from "react-icons/io5";

export default function Navbar() {

    const data = useContext(dataContext)

    return (
        <div className="top-0 left-0 z-10 border-b-1 border-border fixed bg-panel1  w-full h-12 flex items-center justify-between ">
            <div>
                <h1 className="px-3 text-lg font-semibold text-title ">
                    Money<span className="text-highlight">Flow</span>
                </h1>
            </div>
            <div className="h-full flex">
                {!data.hasProfile ?
                    <Link to={"/home"} className="h-full">
                        <button className="hover:cursor-pointer text-subtext1 h-full hover:bg-highlight hover:text-btn-text  text-xs transition-all duration-200 ease-in-out px-3"
                            onClick={() => data.setHasProfile(true)}>
                            Create
                        </button>
                    </Link>
                :
                <>
                    <Link to={"/home"} className="h-full">
                        <button className="hover:cursor-pointer text-subtext1 h-full hover:bg-highlight hover:text-btn-text  text-xs transition-all duration-200 ease-in-out px-3">
                            Create
                        </button>
                    </Link>
                    <Link to={"/simulate"} className="h-full">
                        <button className="hover:cursor-pointer text-subtext1 h-full hover:bg-highlight hover:text-btn-text  text-xs transition-all duration-200 ease-in-out px-3">
                            Simulate
                        </button>
                    </Link>
                    <Link to={"/settings"} className="h-full">
                        <button className="hover:cursor-pointer text-subtext1 h-full hover:bg-highlight hover:text-btn-text  text-xs transition-all duration-200 ease-in-out px-3">
                            {<IoSettingsSharp />}
                        </button>
                    </Link>
                </>}
            </div>
        </div>
    )
}
