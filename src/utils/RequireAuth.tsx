import React, { useContext } from "react";
import { redirect } from "next/navigation";
import { AuthContext } from "../services/AuthContext";
import {jwtDecode} from "jwt-decode";

const RequireAuth = ({ children }: { children: React.ReactNode }) => {
    let { authTokens } = useContext(AuthContext);
    /* TODO improve check */
    if (authTokens) {
        // console.log("Trying to decode:", authTokens)
        const decodedUser: any = jwtDecode(authTokens || "")
        if (decodedUser && decodedUser["role"] === "admin") {
            return <>{children}</>;
        }
    }
    // console.log("Navigating back to login");
    if (typeof window !== 'undefined') {
        redirect("/control-panel/login");
    }
    return null;
};

export default RequireAuth;
