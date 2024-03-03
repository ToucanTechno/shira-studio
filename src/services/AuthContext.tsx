import React, { createContext, useState, ReactNode } from "react";
import { jwtDecode } from "jwt-decode";
import "core-js/stable/atob";

type AccessTokensType = {
    access: string | null;
};

interface CurrentUserContextType {
    authTokens: AccessTokensType;
    setAuthTokens: React.Dispatch<React.SetStateAction<AccessTokensType>>;
    user: string | null;
    setUser: React.Dispatch<React.SetStateAction<string | null>>;
    callLogout: () => void;
}

interface Props {
    children: ReactNode;
}

export const AuthContext = createContext<CurrentUserContextType>(
    {} as CurrentUserContextType
);

export const AuthProvider = (props: Props) => {
    console.log("Starting AuthProvider...")
    let [authTokens, setAuthTokens] = useState<AccessTokensType>(() => {
            let tokenInfo = localStorage.getItem("authTokens");
            console.log("Getting tokenInfo from localStorage, setting initial authTokens in context", tokenInfo);
            return tokenInfo
                ? JSON.parse(localStorage.getItem("authTokens") || "")
                : null;
        }
    );

    let [user, setUser] = useState<string | null>(() => {
            let tokenInfo = localStorage.getItem("authTokens");
            console.log("setting initial user", tokenInfo);
            console.log("Decoded user is: ", (tokenInfo) ? jwtDecode(tokenInfo || "") : null);
            return tokenInfo
                ? jwtDecode(tokenInfo || "")
                : null;
        }
    );

    function callLogout() {
        setAuthTokens({ access: null });
        setUser(null);
        localStorage.removeItem("authTokens");
    }

    return (
        <AuthContext.Provider value={{
            authTokens,
            setAuthTokens,
            callLogout,
            user,
            setUser
        }}>
            { props.children }
        </AuthContext.Provider>
    );
};
