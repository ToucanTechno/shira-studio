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
    tryLockCart: (lockAction: boolean) => Promise<void>; // reject type is "any"
    tryCreateCart: () => Promise<string | null>; // reject type is "any"
    removeCart: () => void;
    wrapUnlockLock: <Args extends any[], Return>(
        cartID: string | null, operation: (...operationParameters: Args) => Return, ...parameters: Args )
        => Promise<Return | undefined>;
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

    /**
     * Lock action is true if we want to lock, false if we want to unlock. currentLockState comes from cart.lock,
     * reminds us to check if cart is already locked/unlocked.
     */
    const tryLockCart = useCallback(async (lockAction: boolean) => {
        if (!guestData) {
            await Promise.reject('No guest data');
            return;
        }
        if (guestData.cartID === null) {
            await Promise.reject(`No cart to ${(lockAction) ? '' : 'un'}lock`);
            return;
        }
        api.put(`cart/${guestData.cartID}/lock`, {lock: lockAction}).then((res) => {
            console.log(`cart ${(lockAction) ? '' : 'un'}lock result:`, res);
            // TODO: how to trigger cart reload in all use cases?
            Promise.resolve(true);
            return;
        }).catch((error) => {
            // TODO: change when error handling updates
            if (error.response.data === "cart already locked") {
                console.log("Trying to lock cart, but cart is already locked");
                Promise.resolve(false);
                return;
            }
            console.error(error);
            console.log('resolve or reject tryLockCart?')
            Promise.reject(error);
        });
    }, [guestData, api]);

    /* Unlocks cart, does action, then locks cart. */
    const wrapUnlockLock = useCallback(async <Args extends any[], Return>(
        cartID: string | null, operation: (...operationParameters: Args) => Return,
        ...parameters: Args
    ): Promise<Return | undefined> => {
        console.log(`outer cartID: ${cartID}`);
        if (cartID === null) {
            throw(Error(`No cart to unlock`));
        }
        const unlockResult = await api.put(`cart/${cartID}/lock`, {lock: false}).then(async (res) => {
            console.log(`cart unlock result:`, res);
            return res;
        }).catch((error) => {
            // TODO: change when error handling updates
            if (error.response.data === "cart already unlocked") {
                console.log("cart already unlocked");
                return;
            }
            console.error(error);
            throw(error);
        });
        console.log("unlock result:", unlockResult);
        const opResult = operation(...parameters);

        // Was locked before, so we need to re-lock the cart
        if (unlockResult !== undefined) {
            await api.put(`cart/${cartID}/lock`,
                {lock: true}).then(async (res) => {
                console.log(`cart lock result:`, res);
                return;
            }).catch((error) => {
                console.error(error);
                throw(error);
            });
        }
        return opResult;
    }, [api, guestData]);

    return (
        <CartContext.Provider value={{
            tryCreateCart,
            removeCart,
            tryLockCart,
            wrapUnlockLock,
        }}>
            { props.children }
        </CartContext.Provider>
    );
};
