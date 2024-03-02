import React, { createContext, useState, ReactNode } from "react";
import { jwtDecode } from "jwt-decode";
import "core-js/stable/atob";

type AccessTokensType = {
    access: string | undefined;
};

interface CurrentUserContextType {
    authTokens: AccessTokensType;
    setAuthTokens: React.Dispatch<React.SetStateAction<AccessTokensType>>;
    user: string | undefined;
    setUser: React.Dispatch<React.SetStateAction<string | undefined>>;
    callLogout: () => void;
}

interface Props {
    children: ReactNode;
}

export const AuthContext = createContext<CurrentUserContextType>(
    {} as CurrentUserContextType
);

export const AuthProvider = (props: Props) => {
    let [authTokens, setAuthTokens] = useState<AccessTokensType>(() => {
            let tokenInfo = localStorage.getItem("authTokens");
            console.log("hello2", tokenInfo);
            return tokenInfo
                ? JSON.parse(localStorage.getItem("authTokens") || "")
                : undefined;
        }
    );

    let [user, setUser] = useState<string | undefined>(() => {
            let tokenInfo = localStorage.getItem("authTokens");
            console.log("hello", tokenInfo);
            return tokenInfo
                ? jwtDecode(tokenInfo || "")
                : undefined;
        }
    );

    function callLogout() {
        setAuthTokens({ access: undefined });
        setUser(undefined);
        localStorage.removeItem("authTokens");
    }

    return (
        <AuthContext.Provider value={{
            setAuthTokens,
            authTokens,
            callLogout,
            user,
            setUser
        }}>
            {/*loading ? props.children : null*/ props.children}
        </AuthContext.Provider>
    );
};
