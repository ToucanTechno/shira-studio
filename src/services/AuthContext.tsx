'use client'

/* eslint-disable react-refresh/only-export-components */
import React, {createContext, useState, ReactNode, useCallback, useEffect} from "react";
import "core-js/stable/atob";
import {v4 as uuidv4} from "uuid";
import {useConst} from "@chakra-ui/react";
import axios from "axios";
import { logger } from "../utils/logger";

export interface GuestDataType {
    guestID: string | null;
    cartID: string | null;
}

interface AuthContextType {
    api: ReturnType<typeof axios.create>;
    authTokens: string | null;
    setAuthTokens: React.Dispatch<React.SetStateAction<string | null>>;
    guestData: GuestDataType;
    setGuestData: React.Dispatch<React.SetStateAction<GuestDataType>>
    callLogout: () => void;
}

interface Props {
    children: ReactNode;
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = (props: Props) => {
    logger.component('AuthProvider', 'Initializing');
    const api = useConst(() => axios.create({baseURL: 'http://localhost:3001/api'}));

    // Initialize state with localStorage values if available (client-side only)
    const [authTokens, setAuthTokens] = useState<string | null>(() => {
        if (typeof window !== 'undefined') {
            const tokenInfo = localStorage.getItem('authTokens');
            logger.component('AuthProvider', 'Initial authTokens from localStorage', tokenInfo ? 'found' : 'not found');
            return tokenInfo ? JSON.parse(tokenInfo) : null;
        }
        return null;
    });

    const [guestData, setGuestData] = useState<GuestDataType>(() => {
        if (typeof window !== 'undefined') {
            let storedGuestID = localStorage.getItem('guestID');
            const storedCartID = localStorage.getItem('cartID');
            
            logger.component('AuthProvider', 'Initial localStorage read', {
                guestID: storedGuestID,
                cartID: storedCartID
            });

            if (storedGuestID === null) {
                storedGuestID = uuidv4();
                logger.component('AuthProvider', 'Generated new guestID', storedGuestID);
                localStorage.setItem('guestID', storedGuestID);
            }

            const initialData = { guestID: storedGuestID, cartID: storedCartID };
            logger.state('AuthProvider', 'guestData', { guestID: null, cartID: null }, initialData);
            return initialData;
        }
        logger.component('AuthProvider', 'Server-side render - using null values');
        return { guestID: null, cartID: null };
    });

    // Hydration effect - only runs on client after server render
    useEffect(() => {
        if (typeof window !== 'undefined' && guestData.guestID === null) {
            logger.component('AuthProvider', 'Hydration - updating from localStorage');
            
            let storedGuestID = localStorage.getItem('guestID');
            const storedCartID = localStorage.getItem('cartID');

            if (storedGuestID === null) {
                storedGuestID = uuidv4();
                logger.component('AuthProvider', 'Hydration - generated new guestID', storedGuestID);
                localStorage.setItem('guestID', storedGuestID);
            }

            const newGuestData = { guestID: storedGuestID, cartID: storedCartID };
            logger.state('AuthProvider', 'guestData (hydration)', guestData, newGuestData);
            setGuestData(newGuestData);
        }
    }, [guestData]); // Include guestData in deps to satisfy exhaustive-deps

    const callLogout = useCallback(() => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('authTokens');
            // TODO: remove cart details and regenerate guest ID
        }
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
            {props.children}
        </AuthContext.Provider>
    );
};