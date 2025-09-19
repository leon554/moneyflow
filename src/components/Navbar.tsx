import { Link } from "react-router-dom"

export default function Navbar() {
    return (
        <div className="top-0 left-0 z-50 border-b-1 border-border fixed bg-panel1  w-full h-12 flex items-center justify-between ">
            <div>
                <h1 className="px-3 text-lg  text-title ">
                    Funnely
                </h1>
            </div>
            <div className="h-full">
                <Link to={"/"} className="h-full"> 
                    <button className="hover:cursor-pointer text-subtext1 h-full hover:bg-highlight hover:text-btn-text text-xs transition-all duration-200 ease-in-out px-3">
                        Landing
                    </button>
                </Link>
                <Link to={"/home"} className="h-full">
                    <button className="hover:cursor-pointer text-subtext1 h-full hover:bg-highlight hover:text-btn-text  text-xs transition-all duration-200 ease-in-out px-3">
                        Home
                    </button>
                </Link>
                <Link to={"/simulate"} className="h-full">
                    <button className="hover:cursor-pointer text-subtext1 h-full hover:bg-highlight hover:text-btn-text  text-xs transition-all duration-200 ease-in-out px-3">
                        Simulate
                    </button>
                </Link>
            </div>
        </div>
    )
}
