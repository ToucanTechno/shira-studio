'use client'

import {
    Flex, Heading,
    Table, TableContainer, Tbody, Td, Tr, Th, Thead,
    Image,
    NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper,
    CloseButton, useToast, Center, Icon
} from "@chakra-ui/react";
import React, {useCallback, useContext, useEffect, useMemo, useState} from "react";
import {AuthContext} from "../services/AuthContext";
import {ICartModel} from "../models/CartModel";
import CartOrder from "./CartOrder";
import {BsCartDash} from "react-icons/bs";
import {CartContext} from "../services/CartContext";
import { useRouter } from "next/navigation";
import { logger } from "../utils/logger";
import { CartLockTimer } from "../components/CartLockTimer";

const Cart = () => {
    const [cart, setCart] = useState<ICartModel | null>(null);
    const { api, guestData } = useContext(AuthContext);
    const { tryLockCart } = useContext(CartContext);
    
    const alertToast = useToast({
        status: 'error',
        isClosable: true,
        position: 'top'
    });
    const [isInLockProcess, setIsInLockProcess] = useState(false);
    const router = useRouter();

    const totalPrice = useMemo(() => {
        if (!cart) {
            return 0;
        }
        return Object.keys(cart.products).map(cartKey => {
            const item = cart.products[cartKey];
            return item.product.price * item.amount;
        }).reduce((sum, current) => sum + current, 0);
    }, [cart]);

    useEffect(() => {
        if (guestData.cartID) {
            api.get(`/cart/${guestData.cartID}`)
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                .then((response: any) => {
                    setCart(response.data);
                })
                .catch(error => {
                    logger.error('Cart', 'Failed to fetch cart:', error);
                });
        }
    }, [api, guestData.cartID]);

    const handleItemCountChange = useCallback(async (val: number, productKey: string) => {
        console.log('=== handleItemCountChange CALLED ===', { val, productKey });
        console.log('Call stack:', new Error().stack);
        
        if (!cart) {
            // Should never happen
            return Promise.reject('No cart to change items count');
        }

        // Check if value actually changed - do this BEFORE unlocking to avoid unnecessary operations
        const amountToChange = val - cart.products[productKey].amount;
        if (amountToChange === 0) {
            console.log('Amount unchanged, skipping update');
            return;
        }

        // Try to unlock cart if it was previously locked
        let wasPreviouslyLocked;
        try {
            // if lock state changed while unlocking, it means cart was previously locked
            wasPreviouslyLocked = await tryLockCart(false);
            if (wasPreviouslyLocked) {
                setIsInLockProcess(true);
            }
        } catch (error) {
            return Promise.reject(error);
        }

        // Alert about limited stock
        if (val > cart.products[productKey].product.stock) {
            alertToast({
                title: 'מלאי מוגבל',
                description: `מוצר: ${cart.products[productKey].product.name}`,
            });
            return;
        }

        // Update product amount in DB
        console.log('amount to change', amountToChange)
        try {
            await api.put(`/cart/${guestData.cartID}`, {
                productId: productKey,
                amount: amountToChange
            });
        } catch (error) {
            return Promise.reject(error);
        }

        // If we changed product number to 0, remove it from cart
        if (val === 0) {
            delete cart.products[productKey]
        } else {
            cart.products[productKey].amount = val;
        }

        // Re-lock cart if needed
        if (wasPreviouslyLocked) {
            try {
                await tryLockCart(true);
                setIsInLockProcess(false);
            } catch (error) {
                return Promise.reject(error);
            }
        }
        setCart({...cart, products: cart.products});
        console.log("Finished updating product:", productKey, val);
    }, [alertToast, api, cart, guestData.cartID, tryLockCart]);

    const handleClose = useCallback((productKey: string) => {
        console.log('Closing', productKey);
        handleItemCountChange(0, productKey);
    }, [handleItemCountChange]);

    const handleLockExpire = useCallback(async () => {
        console.log('=== handleLockExpire CALLED ===');
        console.log('Call stack:', new Error().stack);
        logger.log('[CART] Lock expired, unlocking cart');
        
        alertToast({
            title: 'הזמן פג',
            description: 'הזמן להשלמת ההזמנה פג. העגלה שוחררה.',
            status: 'warning',
            duration: 5000,
        });
        
        try {
            await tryLockCart(false);
            // Reload the page to refresh cart state
            window.location.reload();
        } catch (error) {
            logger.error('[CART] Failed to unlock expired cart:', error);
        }
    }, [tryLockCart, alertToast]);

    if (!cart || Object.keys(cart.products).length === 0) {
        logger.component('Cart', 'Rendering empty cart message', {
            hasCart: !!cart,
            productCount: cart ? Object.keys(cart.products).length : 0
        });
        return (
            <Center>
                <Heading as='h2'>עגלת הקניות ריקה<Icon ms={3} boxSize='.7em' as={BsCartDash}/></Heading>
            </Center>
        );
    }
    
    logger.component('Cart', 'Rendering cart with products', {
        productCount: Object.keys(cart.products).length,
        totalPrice
    });
    
    return (
        <Flex direction='column' align='center' w={['100%', '100%', '80%']} alignSelf='center'>
            <Heading as='h1' p={2}>עגלת קניות</Heading>
            
            {cart?.lock && cart?.lockExpiresAt && (
                <CartLockTimer
                    lockExpiresAt={cart.lockExpiresAt}
                    onExpire={handleLockExpire}
                />
            )}
            <TableContainer w='100%'>
                <Table colorScheme='orange' size={['sm', 'sm', 'md']}>
                    <Thead>
                        <Tr>
                            <Th></Th>
                            <Th>מוצר</Th>
                            <Th>מחיר פריט</Th>
                            <Th>כמות</Th>
                            <Th></Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {cart && Object.keys(cart.products).map(productKey => {
                            const item = cart.products[productKey];
                            return (
                                <Tr key={item.product._id}>
                                    <Td><Image src={item.product.images?.[0]?.url || '/placeholder.jpg'} alt={item.product.name} boxSize='50px' objectFit='cover'/></Td>
                                    <Td>{item.product.name}</Td>
                                    <Td>{item.product.price}₪</Td>
                                    <Td>
                                        {/* TODO: on blue ask user whether to remove item */}
                                        {/* TODO: make disabled until request is complete and send the request with a slight delay */}
                                        <NumberInput name='amount'
                                                     value={cart.products[productKey].amount}
                                                     onChange={(_, val) =>
                                                         handleItemCountChange(val, productKey)}
                                                     allowMouseWheel
                                                     size='sm'
                                                     w={16}
                                                     min={0}
                                                     max={99}
                                                     isDisabled={isInLockProcess}>
                                            <NumberInputField/>
                                            <NumberInputStepper>
                                                <NumberIncrementStepper/>
                                                <NumberDecrementStepper/>
                                            </NumberInputStepper>
                                        </NumberInput>
                                    </Td>
                                    <Td>
                                        <CloseButton onClick={() => {
                                            handleClose(productKey)
                                        }}/>
                                    </Td>
                                </Tr>
                            );
                        })
                        }
                    </Tbody>
                </Table>
            </TableContainer>
            <CartOrder totalPrice={totalPrice} cartID={guestData.cartID} cart={cart} setCart={setCart} navigate={router}/>
        </Flex>
    );
};

export default Cart;