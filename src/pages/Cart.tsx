import {
    Flex, Heading,
    Table, TableContainer, Tbody, Td, Tr, Th, Thead,
    Image,
    NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper,
    CloseButton, useConst, useToast, Center, Icon
} from "@chakra-ui/react";
import React, {useCallback, useContext, useEffect, useMemo, useState} from "react";
import axios, {AxiosInstance} from "axios";
import {AuthContext} from "../services/AuthContext";
import {ICartModel} from "../models/CartModel";
import CartOrder from "./CartOrder";
import {BsCartDash} from "react-icons/bs";
import {useBlocker} from "react-router-dom";

const Cart = () => {
    const [cart, setCart] = useState<ICartModel | null>(null);
    const api = useConst<AxiosInstance>(() => axios.create({baseURL: 'http://localhost:3001/api'}));
    const { guestData} = useContext(AuthContext)
    const alertToast = useToast({
        status: 'error',
        isClosable: true,
        position: 'top'
    })
    let leaveCartBlocker = useBlocker(
        ({ currentLocation, nextLocation }) =>
            (cart !== null && cart.lock && currentLocation.pathname !== nextLocation.pathname)
    )

    useEffect(() => {
        if (leaveCartBlocker.state === "blocked") {
            console.log("unblocking");
            leaveCartBlocker.proceed();
        }
    }, [leaveCartBlocker]);

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
            api.get(`/cart/${guestData.cartID}`).then(response => {
                setCart(response.data);
            }).catch(error => {
                console.log("error:", error);
            })
        }
    }, [api, guestData]);

    const handleItemCountChange = useCallback((val: number, productKey: string) => {
        if (!cart) {
            return;
        }
        if (val > cart.products[productKey].product.stock) {
            alertToast({
                title: 'אין במלאי מעבר לכמות זו',
                description: `מוצר: ${cart.products[productKey].product.name}`,
            });
            return;
        }
        const amountToChange = val - cart.products[productKey].amount;
        if (amountToChange === 0) {
            return;
        }
        api.put(`/cart/${guestData.cartID}`, {
            productId: productKey,
            amount: amountToChange
        }).then((res) => {
            if (val === 0) {
                delete cart.products[productKey]
            } else {
                cart.products[productKey].amount = val;
            }
            setCart({...cart, products: cart.products});
            console.log(val, productKey);
            console.log(res)
        }).catch(error => console.error(error));
    }, [alertToast, api, cart, guestData.cartID]);

    const handleClose = useCallback((productKey: string) => {
        console.log('Closing', productKey);
        handleItemCountChange(0, productKey);
    }, [handleItemCountChange]);

    if (!cart || Object.keys(cart.products).length === 0) {
        return (
            <Center>
                    <Heading as='h2'>עגלת הקניות ריקה<Icon ms={3} boxSize='.7em' as={BsCartDash}/></Heading>

            </Center>
        )
    }
    return (
        <Flex direction='column' align='center' w={['100%', '100%', '80%']} alignSelf='center'>
            <Heading as='h1' p={2}>עגלת קניות</Heading>
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
                            let item = cart.products[productKey];
                            return (
                                <Tr key={item.product._id}>
                                    <Td><Image src='test.jpg' alt='test.jpg'/></Td>
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
                                                     max={99}>
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
            {/* TODO: move to another component */}
            <CartOrder totalPrice={totalPrice} cartID={guestData.cartID}/>
        </Flex>
    );
};

export default Cart;
