import React from "react";
import {Route, Routes} from "react-router-dom";
import PanelLogin from "./PanelLogin";
import Panel from "./Panel";

const PanelApp = () => {
    return (
        <Routes>
            <Route path="/" element={<Panel/>}/>
            <Route path="/login" element={<PanelLogin/>}/>
        </Routes>
    )
};

export default PanelApp;
