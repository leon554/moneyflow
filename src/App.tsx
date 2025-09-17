import { HashRouter as Router, Route, Routes } from "react-router-dom"
import Home from "./pages/Home";
import Layout from "./pages/Layout";
import Landing from "./pages/Landing";

export default function App() {
    return (
       <Router>
            <Routes>
                <Route element={<Layout/>}>
                    <Route path="/home" element={<Home/>}/>
                    <Route path="/" element={<Landing/>}/>
                </Route>
            </Routes>
       </Router>
    );
}
