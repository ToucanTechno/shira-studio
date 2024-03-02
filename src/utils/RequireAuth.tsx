import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../services/AuthContext";

const RequireAuth = () => {
    let { user } = useContext(AuthContext);
    if (!user) {
        return <Navigate to="/control-panel/login" />;
    }
    return <Outlet />;
};

export default RequireAuth;
