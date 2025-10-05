import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Alert from "@/Alert/Alert";


export default function Layout() {
    return (
        <div>
            <Navbar/>
            <Alert/>
            <main className="">
                <Outlet/>
            </main>
        </div>
    )
}
