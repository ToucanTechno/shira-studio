import React from "react";
import {Route, Routes} from "react-router-dom";
import PanelLogin from "./PanelLogin";
import Panel from "./Panel";
import RequireAuth from "../../utils/RequireAuth";
import {AuthProvider} from "../../services/AuthContext";

const PanelApp = () => {
    return (
        <AuthProvider>
            <Routes>
                <Route element={<RequireAuth/>}>
                    <Route path="/" element={<Panel/>}/>
                </Route>
                <Route path="/login" element={<PanelLogin/>}/>
            </Routes>
        </AuthProvider>
    )
};

export default PanelApp;
