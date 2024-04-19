import React, { createContext, useState, ReactNode } from "react";
import "core-js/stable/atob";
import {v4 as uuidv4} from "uuid";

interface CurrentUserContextType {
    authTokens: string | null;
    setAuthTokens: React.Dispatch<React.SetStateAction<string | null>>;
    guestData: {guestID: string | null, cartID: string | null};
    setGuestData: React.Dispatch<React.SetStateAction<{guestID: string | null, cartID: string | null}>>;
    callLogout: () => void;
}

interface Props {
    children: ReactNode;
}

export const AuthContext = createContext<CurrentUserContextType>(
    {} as CurrentUserContextType
);

export const AuthProvider = (props: Props) => {
    // console.log("Starting AuthProvider...")
    let [authTokens, setAuthTokens] = useState<string | null>(() => {
            let tokenInfo = localStorage.getItem("authTokens");
            // console.log("Getting tokenInfo from localStorage, setting initial authTokens in context", tokenInfo);
            return tokenInfo
                ? JSON.parse(tokenInfo || "")
                : null;
        }
    );
    let [guestData, setGuestData] =
            useState<{guestID: string | null, cartID: string | null}>(() => {
        let storedGuestID = localStorage.getItem("guestID");
        let storedCartID = localStorage.getItem("cartID");
        // console.log("stored guest ID", storedGuestID);
        if (storedGuestID === null) {
            storedGuestID = uuidv4();
            // console.log("new guest ID", storedGuestID);
            localStorage.setItem("guestID", storedGuestID as string);
        }
        return {guestID: storedGuestID, cartID: storedCartID};
    });

    function callLogout() {
        localStorage.removeItem("authTokens");
        setAuthTokens(null);
    }

    return (
        <AuthContext.Provider value={{
            authTokens,
            setAuthTokens,
            guestData,
            setGuestData,
            callLogout,
        }}>
            { props.children }
        </AuthContext.Provider>
    );
};
