import React, { createContext, ReactNode, useCallback } from "react";
import { AxiosInstance } from "axios";
import { GuestDataType } from "./AuthContext";

interface Props {
    children: ReactNode;
    api: AxiosInstance;
    guestData: GuestDataType;
    setGuestData: React.Dispatch<React.SetStateAction<GuestDataType> >;
}

interface CartContextType {
    tryLockCart: (lockAction: boolean) => Promise<boolean>; // reject type is "any"
    tryCreateCart: () => Promise<string | null>; // reject type is "any"
    getProductCount: (productID: string | undefined) => Promise<number>;
    removeCart: () => void;
    wrapUnlockLock: <Args extends any[], Return>(
        cartID: string | null, operation: (...operationParameters: Args) => Return, ...parameters: Args )
        => Promise<Return | boolean>;
}
export const CartContext = createContext<CartContextType>( {} as CartContextType );

export const CartProvider = (props: Props) => {
    // TODO: separate to child CartProvider object
    const guestData = props.guestData;
    console.log(`re-rendering cart provider with cart: ${guestData.cartID}`);
    const setGuestData = props.setGuestData;
    const api = props.api;
    const tryCreateCart = useCallback(async () => {
        if (guestData.cartID === null) {
            return await api.post(`/cart`,
                {userId: null}) // Don't pass userId for guest carts
                .then(response => {
                    console.log('Done creating cart', response)
                    const createdCartID = response.data['id'];
                    if (createdCartID === null) {
                        throw(Error("Failed creating cart ID"));
                    }
                    localStorage.setItem('cartID', createdCartID as string);
                    console.log(`setting new cart: ${createdCartID}`);
                    setGuestData({ guestID: guestData.guestID, cartID: createdCartID });
                    return (createdCartID as string);
                })
                .catch(error => {
                    // Handle any errors
                    console.error(`tryCreateCart error: ${error}`);
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
            console.error("Trying to get an undefined productID");
            return 0;
        }
        const cartResult = await api.get(`cart/${guestData.cartID}`);
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
            const lockResult = await api.put(`cart/${guestData.cartID}/lock`, {lock: lockAction});
            console.log(`cart ${(lockAction) ? '' : 'un'}lock result:`, lockResult);
            // TODO: how to trigger cart reload in all use cases?
            return Promise.resolve(true);
        } catch(error: any) {
            // TODO: change when error handling updates
            if (error.response.data === "cart already locked") {
                console.log("Trying to lock cart, but cart is already locked");
                return Promise.resolve(false);
            } else if (error.response.data === "cart already unlocked") {
                console.log("Trying to unlock cart, but cart is already unlocked");
                return Promise.resolve(false);
            }
            console.error(error);
            console.log('resolve or reject tryLockCart?')
            return Promise.reject(error);
        }
    }, [guestData, api]);

    /* Unlocks cart, does action, then locks cart. */
    const wrapUnlockLock = useCallback(async <TArgs extends any[], TReturn>(
        cartID: string | null, operation: (...operationParameters: TArgs) => TReturn,
        ...parameters: TArgs
    ): Promise<TReturn | boolean> => {
        console.log(`outer cartID: ${cartID}`);
        if (cartID === null) {
            return Promise.reject(`No cart to unlock`);
        }
        let unlockResult;
        try {
            unlockResult = await api.put(`cart/${cartID}/lock`, {lock: false});
            console.log(`cart unlock result:`, unlockResult);
        } catch(error: any) {
            // TODO: change when error handling updates
            if (error.response.data === "cart already unlocked") {
                console.log("cart already unlocked");
            } else {
                return Promise.reject(error);
            }
        }
        console.log("unlock result:", unlockResult);
        const opResult = operation(...parameters);

        // Was locked before, so we need to re-lock the cart
        if (unlockResult !== undefined) {
            try {
                const lockResult = await api.put(`cart/${cartID}/lock`, {lock: true});
                console.log(`cart lock result:`, lockResult);
            } catch(error: any) {
                return Promise.reject(error);
            }
        }
        return opResult;
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
