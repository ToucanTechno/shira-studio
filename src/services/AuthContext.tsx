import React, {createContext, useState, ReactNode, useCallback} from "react";
import "core-js/stable/atob";
import {v4 as uuidv4} from "uuid";
import {useConst} from "@chakra-ui/react";
import axios, {AxiosInstance} from "axios";

export interface GuestDataType {
    guestID: string | null;
    cartID: string | null;
}
interface AuthContextType {
    api: AxiosInstance;
    authTokens: string | null;
    setAuthTokens: React.Dispatch<React.SetStateAction<string | null>>;
    guestData: GuestDataType;
    setGuestData: React.Dispatch<React.SetStateAction<GuestDataType>>
    callLogout: () => void;
}

interface Props {
    children: ReactNode;
}

export const AuthContext = createContext<AuthContextType>( {} as AuthContextType );

export const AuthProvider = (props: Props) => {
    // console.log("Starting AuthProvider...")
    const api = useConst<AxiosInstance>(() => axios.create({baseURL: 'http://localhost:3001/api'}));
    let [authTokens, setAuthTokens] = useState<string | null>(() => {
            let tokenInfo = localStorage.getItem("authTokens");
            // console.log("Getting tokenInfo from localStorage, setting initial authTokens in context", tokenInfo);
            return tokenInfo
                ? JSON.parse(tokenInfo || "")
                : null;
        }
    );
    let [guestData, setGuestData] =
            useState<GuestDataType>(() => {
        let storedGuestID = localStorage.getItem("guestID");
        let storedCartID = localStorage.getItem("cartID");
        // console.log("stored guest ID", storedGuestID);
        if (storedGuestID === null) {
            storedGuestID = uuidv4();
            // console.log("new guest ID", storedGuestID);
            localStorage.setItem("guestID", storedGuestID as string);
        }
        return { guestID: storedGuestID, cartID: storedCartID };
    });

    const callLogout = useCallback(() => {
        localStorage.removeItem("authTokens");
        // TODO: remove cart details and regenerate guest ID
        setAuthTokens(null);
    }, []);

    return (
        <AuthContext.Provider value={{
            api,
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
