
/* eslint-disable react-refresh/only-export-components */
import React, { createContext, ReactNode, useCallback } from "react";
import axios from "axios";
import { GuestDataType } from "./AuthContext";
import { logger } from "../utils/logger";

interface Props {
    children: ReactNode;
    api: ReturnType<typeof axios.create>;
    guestData: GuestDataType;
    setGuestData: React.Dispatch<React.SetStateAction<GuestDataType> >;
}

interface CartContextType {
    tryLockCart: (lockAction: boolean) => Promise<boolean>; // reject type is "any"
    tryCreateCart: () => Promise<string | null>; // reject type is "any"
    getProductCount: (productID: string | undefined) => Promise<number>;
    removeCart: () => void;
    wrapUnlockLock: <Args extends unknown[], Return>(
        cartID: string | null, operation: (...operationParameters: Args) => Return, ...parameters: Args )
        => Promise<Return | boolean>;
}
export const CartContext = createContext<CartContextType>( {} as CartContextType );

export const CartProvider = (props: Props) => {
    // TODO: separate to child CartProvider object
    const guestData = props.guestData;
    const setGuestData = props.setGuestData;
    const api = props.api;
    
    logger.component('CartProvider', 'Re-rendering', {
        cartID: guestData.cartID,
        guestID: guestData.guestID
    });
    const tryCreateCart = useCallback(async () => {
        if (guestData.cartID === null) {
            return await api.post<{ id: string | null }>(`/cart`,
                {userId: null}) // Don't pass userId for guest carts
                .then((response) => {
                    logger.log('Done creating cart', response)
                    const createdCartID = response.data.id;
                    if (createdCartID === null) {
                        throw(Error("Failed creating cart ID"));
                    }
                    localStorage.setItem('cartID', createdCartID as string);
                    logger.log(`setting new cart: ${createdCartID}`);
                    setGuestData({ guestID: guestData.guestID, cartID: createdCartID });
                    return (createdCartID as string);
                })
                .catch((error: unknown) => {
                    // Handle any errors
                    logger.error(`tryCreateCart error: ${error}`);
                    throw(error);
                });
        } else {
            return null;
        }
    }, [guestData, setGuestData, api]); // Will enter twice due to guestData, skips if-condition on second entry

    const removeCart = useCallback(() => {
        localStorage.removeItem('cartID');
        setGuestData((guestData) => ({...guestData, cartID: null}));
    }, [setGuestData]);

    const getProductCount = useCallback(async (productID: string | undefined) => {
        // If function received an undefined productID, shouldn't get here
        if (productID === undefined) {
            logger.error("Trying to get an undefined productID");
            return 0;
        }
        const cartResult = await api.get<{ products: Record<string, { amount: number }> }>(`/cart/${guestData.cartID}`);
        if (productID in cartResult.data.products) {
            return cartResult.data.products[productID].amount;
        }
        // If product doesn't exist in cart
        return 0;
    }, [guestData.cartID, api]);

    /**
     * Lock action is true if we want to lock, false if we want to unlock.
     * Resolves with true if cart was locked/unlocked successfully.
     * If cart is already locked or unlocked, resolves with false.
     */
    const tryLockCart = useCallback(async (lockAction: boolean) => {
        if (!guestData) {
            return Promise.reject('No guest data');
        }
        if (guestData.cartID === null) {
            return Promise.reject(`No cart to ${(lockAction) ? '' : 'un'}lock`);
        }
        try {
            const lockResult = await api.put(`/cart/${guestData.cartID}/lock`, {lock: lockAction});
            logger.log(`cart ${(lockAction) ? '' : 'un'}lock result:`, lockResult);
            // TODO: how to trigger cart reload in all use cases?
            return Promise.resolve(true);
        } catch(error: unknown) {
            // TODO: change when error handling updates
            const axiosError = error as { response?: { data?: string } };
            if (axiosError.response?.data === "cart already locked") {
                logger.log("Trying to lock cart, but cart is already locked");
                return Promise.resolve(false);
            } else if (axiosError.response?.data === "cart already unlocked") {
                logger.log("Trying to unlock cart, but cart is already unlocked");
                return Promise.resolve(false);
            }
            logger.error(error);
            logger.log('resolve or reject tryLockCart?')
            return Promise.reject(error);
        }
    }, [guestData, api]);

    /* Unlocks cart, does action, then locks cart. */
    const wrapUnlockLock = useCallback(async <TArgs extends unknown[], TReturn>(
        cartID: string | null, operation: (...operationParameters: TArgs) => TReturn,
        ...parameters: TArgs
    ): Promise<TReturn | boolean> => {
        logger.log(`=== WRAP UNLOCK LOCK START ===`);
        logger.log(`Cart ID: ${cartID}`);

        if (cartID === null) {
            logger.log('No cart ID provided, rejecting');
            return Promise.reject(`No cart to unlock`);
        }

        let wasLocked = false;

        // First, check current cart lock state
        try {
            logger.log('Checking cart lock state...');
            const cartResponse = await api.get<{ lock: boolean }>(`/cart/${cartID}`);
            const currentLockState = cartResponse.data.lock;
            logger.log(`Current cart lock state: ${currentLockState ? 'LOCKED' : 'UNLOCKED'}`);

            // Only attempt to unlock if cart is actually locked
            if (currentLockState) {
                logger.log('Cart is locked, unlocking...');
                const unlockResult = await api.put(`/cart/${cartID}/lock`, {lock: false});
                logger.log(`Cart unlock successful:`, unlockResult.data);
                wasLocked = true; // Cart was locked, so we unlocked it
            } else {
                logger.log('Cart is already unlocked, skipping unlock step');
                wasLocked = false; // Cart was already unlocked
            }
        } catch(error: unknown) {
            logger.error('Failed to check/unlock cart:', error);
            return Promise.reject(error);
        }

        logger.log("About to execute operation...");
        let opResult: TReturn | undefined;
        let operationError: unknown;

        // Execute the operation
        try {
            opResult = await operation(...parameters);
            logger.log('Operation completed successfully');
        } catch (error) {
            logger.log('Operation failed:', error);
            operationError = error;
        }

        // Re-lock the cart only if it was originally locked
        if (wasLocked) {
            try {
                logger.log('Re-locking cart (was originally locked)...');
                const lockResult = await api.put(`/cart/${cartID}/lock`, {lock: true});
                logger.log(`Cart re-lock successful:`, lockResult.data);
            } catch(error: unknown) {
                logger.error('Failed to re-lock cart:', error);
                // Don't throw here - we want to return the original operation result/error
            }
        } else {
            logger.log('Skipping re-lock (cart was originally unlocked)');
        }

        logger.log(`=== WRAP UNLOCK LOCK END ===`);

        // If the operation failed, throw that error
        if (operationError) {
            throw operationError;
        }

        return opResult as TReturn;
    }, [api]);

    return (
        <CartContext.Provider value={{
            tryCreateCart,
            removeCart,
            getProductCount,
            tryLockCart,
            wrapUnlockLock,
        }}>
            { props.children }
        </CartContext.Provider>
    );
};