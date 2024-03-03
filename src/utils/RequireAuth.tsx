import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../services/AuthContext";
import {jwtDecode} from "jwt-decode";

const RequireAuth = () => {
    let { authTokens } = useContext(AuthContext);
    /* TODO improve check */
    if (authTokens) {
        const decodedUser: any = jwtDecode(authTokens.access || "")
        if (decodedUser && decodedUser["role"] === "admin") {
            return <Outlet />
        }
    }
    console.log("Navigating back to login");
    return <Navigate to="/control-panel/login" />;
};

export default RequireAuth;
