import { HashRouter as Router, Route, Routes } from "react-router-dom"
import Home from "./pages/Home";
import Layout from "./pages/Layout";
import Landing from "./pages/Landing";
import DataProvider from "./providers/DataProvider";
import Simulate from "./pages/Simulate";
import { ReactFlowProvider } from "@xyflow/react";
import AlertProvider from "./Alert/AlertProvider";



export default function App() {
    
    return (
        <Router>
                <ReactFlowProvider>
            <AlertProvider>
                    <DataProvider>
                                <Routes>
                                    <Route element={<Layout/>}>
                                            <Route path="/simulate" element={<Simulate/>}/>
                                            <Route path="/home" element={<Home/>}/>
                                            <Route path="/" element={<Landing/>}/>
                                    </Route>
                                </Routes>
                    </DataProvider>
            </AlertProvider>
                </ReactFlowProvider>
        </Router>
    );
}
