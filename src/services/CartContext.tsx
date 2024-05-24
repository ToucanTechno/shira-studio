import React, { createContext, ReactNode, useCallback } from "react";
import { AxiosInstance } from "axios";
import { GuestDataType } from "./AuthContext";

interface Props {
    children: ReactNode;
    api: AxiosInstance;
    guestData: GuestDataType;
    setGuestData: React.Dispatch<React.SetStateAction<GuestDataType>>
}

interface CartContextType {
    tryCreateCart: () => Promise<void>; // reject type is "any"
    tryLockCart: (lockAction: boolean) => Promise<void>; // reject type is "any"
    wrapUnlockLock: <Args extends any[], Return>(
        operation: (...operationParameters: Args) => Return, ...parameters: Args )
        => Promise<Return | undefined>;
}
export const CartContext = createContext<CartContextType>( {} as CartContextType );

export const CartProvider = (props: Props) => {
    // TODO: separate to child CartProvider object
    const guestData = props.guestData;
    const setGuestData = props.setGuestData;
    const api = props.api;
    const tryCreateCart = useCallback(async () => {
        if (guestData.cartID === null) {
            await api.post(`/cart`,
                {})
                .then(response => {
                    console.log('Done creating cart', response)
                    const createdCartID = response.data['id'];
                    if (createdCartID === null) {
                        Promise.reject("Failed creating cart ID");
                        return;
                    }
                    localStorage.setItem("cartID", createdCartID as string);
                    setGuestData({ guestID: guestData.guestID, cartID: createdCartID });
                    Promise.resolve();
                })
                .catch(error => {
                    // Handle any errors
                    console.error(`tryCreateCart error: ${error}`);
                    Promise.reject(error);
                });
        }
    }, [guestData, setGuestData, api]); // Will enter twice due to guestData, skips if-condition on second entry

    /**
     * Lock action is true if we want to lock, false if we want to unlock. currentLockState comes from cart.lock,
     * reminds us to check if cart is already locked/unlocked.
     */
    const tryLockCart = useCallback(async (lockAction: boolean) => {
        if (!props.guestData) {
            await Promise.reject('No guest data');
            return;
        }
        if (props.guestData.cartID === null) {
            await Promise.reject(`No cart to ${(lockAction) ? '' : 'un'}lock`);
            return;
        }
        props.api.put(`cart/${props.guestData.cartID}/lock`, {lock: lockAction}).then((res) => {
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
    }, [props.guestData, props.api]);

    /* Unlocks cart, does action, then locks cart. */
    const wrapUnlockLock = useCallback(async <Args extends any[], Return>(
        operation: (...operationParameters: Args) => Return,
        ...parameters: Args
    ): Promise<Return | undefined> => {
        console.log(`outer `);
        if (props.guestData.cartID === null) {
            await Promise.reject(`No cart to unlock`);
            return;
        }
        const unlockResult = await props.api.put(`cart/${props.guestData.cartID}/lock`, {lock: false}).then(async (res) => {
            console.log(`cart unlock result:`, res);
            return res;
        }).catch((error) => {
            // TODO: change when error handling updates
            if (error.response.data === "cart already unlocked") {
                console.log("cart already unlocked");
                return;
            }
            console.error(error);
            Promise.reject(error);
        });
        console.log("unlock result:", unlockResult);
        const opResult = operation(...parameters);

        // Was locked before, so we need to re-lock the cart
        if (unlockResult !== undefined) {
            await props.api.put(`cart/${props.guestData.cartID}/lock`,
                {lock: true}).then(async (res) => {
                console.log(`cart lock result:`, res);
                return;
            }).catch((error) => {
                console.error(error);
                Promise.reject(error);
            });
        }
        return opResult;
    }, [props.api, props.guestData]);

    return (
        <CartContext.Provider value={{
            tryCreateCart,
            tryLockCart,
            wrapUnlockLock
        }}>
            { props.children }
        </CartContext.Provider>
    );
};
