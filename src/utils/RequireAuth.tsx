import React, { useContext } from "react";
import { redirect } from "next/navigation";
import { AuthContext } from "../services/AuthContext";
import {jwtDecode} from "jwt-decode";

interface DecodedToken {
    role?: string;
    [key: string]: unknown;
}

const RequireAuth = ({ children }: { children: React.ReactNode }) => {
    const { authTokens } = useContext(AuthContext);
    /* TODO improve check */
    if (authTokens) {
        // console.log("Trying to decode:", authTokens)
        const decodedUser = jwtDecode<DecodedToken>(authTokens || "")
        if (decodedUser && decodedUser.role === "admin") {
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
