import { HashRouter as Router, Route, Routes } from "react-router-dom"
import Home from "./pages/Home";
import Layout from "./pages/Layout";
import Landing from "./pages/Landing";
import DataProvider from "./providers/DataProvider";
import Simulate from "./pages/Simulate";
import { ReactFlowProvider } from "@xyflow/react";



export default function App() {
    
    return (
        <ReactFlowProvider>
            <DataProvider>
                <Router>
                        <Routes>
                            <Route element={<Layout/>}>
                                    <Route path="/simulate" element={<Simulate/>}/>
                                    <Route path="/home" element={<Home/>}/>
                                    <Route path="/" element={<Landing/>}/>
                            </Route>
                        </Routes>
                </Router>
            </DataProvider>
        </ReactFlowProvider>
    );
}
