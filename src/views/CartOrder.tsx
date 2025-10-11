'use client'

import {
    Button, Card, Center, Collapse, Fade,
    Flex, FormControl, FormHelperText, FormLabel, Heading, Input, Radio, RadioGroup, Spacer,
    Stack, Table, TableCaption, TableContainer, Tbody, Td, Text, Tfoot, Tr, useDisclosure, useToast,
    Wrap
} from "@chakra-ui/react";
import React, {
    ChangeEvent, Dispatch, FormEvent, useCallback, useContext, useMemo, useRef, useState
} from "react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { AuthContext } from "../services/AuthContext";
import { ICartModel } from "../models/CartModel";
import { CartContext } from "../services/CartContext";
import {isEmailValidUI, isPhoneValidUI, isPostCodeValidUI} from "../utils/Validation";
import { logger } from "../utils/logger";

interface CartOrderProps {
    totalPrice: number;
    cartID: string | null;
    cart: ICartModel | null;
    setCart: Dispatch<ICartModel | null>;
    navigate: AppRouterInstance;
}

const CartOrder = (props: CartOrderProps) => {
    // TODO: need to save isOpen and the form details (encrypted in some way) in local storage
    const { isOpen, onClose } = useDisclosure({ defaultIsOpen: true })
    const [email, setEmail] = useState<string>('');
    const isEmailValid = useMemo(() => isEmailValidUI(email), [email])
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [phone, setPhone] = useState<string>('');
    const isPhoneValid = useMemo(() => isPhoneValidUI(phone), [phone])
    const [city, setCity] = useState<string>('');
    const [street, setStreet] = useState<string>('');
    const [postCode, setPostCode] = useState<string>('');
    const isPostCodeValid = useMemo(() => isPostCodeValidUI(postCode), [postCode])
    const [houseNumber, setHouseNumber] = useState<string>('');
    const [entry, setEntry] = useState<string>('');
    const [apartment, setApartment] = useState<string>('');
    const [shipmentMethod, setShipmentMethod] = useState<string>('signed_mail');

    const { api } = useContext(AuthContext)
    const { tryLockCart, removeCart } = useContext(CartContext);
    const formRefs = {
        email: useRef<HTMLInputElement>(null),
        phone: useRef<HTMLInputElement>(null),
        postCode: useRef<HTMLInputElement>(null)
    }

    const createOrder = (ev: FormEvent<HTMLFormElement>) => {
        ev.preventDefault();
        if (props.cartID === null) {
            logger.error('missing cart ID');
            return;
        } else if (!isEmailValid) {
            formRefs.email.current?.focus();
            return;
        } else if (!isPhoneValid) {
            formRefs.phone.current?.focus();
            return;
        } else if (!isPostCodeValid) {
            formRefs.postCode.current?.focus();
            return;
        }
        logger.log(ev);
        // TODO: lock cart if unlocked
        // TODO: test added / removed amounts when cart is locked
        api.post('/api/orders', {
            cart: props.cartID,
            name: `${firstName} ${lastName}`,
            phone: phone,
            country: 'ישראל',
            city: city,
            street: street,
            zipCode: parseInt(postCode),
            houseNumber: houseNumber,
            entry: entry,
            apartment: apartment,
            shipmentMethod: shipmentMethod,
            comments: 'TODO'
        }).then(res => {
            logger.log(`Order ID: ${res.data}`);
            removeCart();
            // Navigate to order summary page with order ID
            props.navigate.push(`/order-summary?orderId=${res.data}`);
        }).catch(error => {
            logger.error(error);
            // Handle error - maybe show a toast or error message
        });
    };

    const toast = useToast();
    const [isLocking, setIsLocking] = useState(false);
    
    const refreshCart = useCallback(async () => {
        if (!props.cartID) return;
        
        try {
            const response = await api.get<ICartModel>(`/cart/${props.cartID}`);
            props.setCart(response.data);
            logger.log('Cart refreshed successfully with updated stock values');
        } catch (error) {
            logger.error('Failed to refresh cart:', error);
        }
    }, [api, props]);
    
    const handleOrderProceed = useCallback(async () => {
        logger.log('=== handleOrderProceed START ===');
        if (props.cart === null) {
            logger.error('null cart');
            return;
        }
        
        // Prevent concurrent lock operations
        if (isLocking) {
            logger.log('Lock operation already in progress, ignoring click');
            return;
        }
        
        logger.log('Current cart state:', {
            cartId: props.cartID,
            isLocked: props.cart.lock,
            productsCount: props.cart.products?.size || 0
        });
        
        // Check if cart is already locked
        if (props.cart.lock) {
            logger.log('Cart is already locked, skipping lock attempt');
            onClose();
            return;
        }
        
        setIsLocking(true);
        logger.log('Attempting to lock cart...');
        try {
            const lockResult = await tryLockCart(true);
            logger.log('Lock result:', lockResult);
            
            // Refresh cart to get updated stock values after locking
            await refreshCart();
            
            onClose();
        } catch(error: unknown) {
            setIsLocking(false);
            logger.error('Failed to lock cart - Full error object:', error);
            
            // Extract error message from the response
            let errorMessage = 'שגיאה בנעילת העגלה';
            
            if (error && typeof error === 'object') {
                const err = error as { response?: { data?: unknown }; message?: string };
                
                logger.log('Error structure:', {
                    hasResponse: !!err.response,
                    hasData: !!err.response?.data,
                    dataType: typeof err.response?.data,
                    data: err.response?.data,
                    hasMessage: !!err.message,
                    message: err.message
                });
                
                // Check if response.data has a message property
                if (err.response?.data && typeof err.response.data === 'object' && 'message' in err.response.data) {
                    errorMessage = (err.response.data as { message: string }).message;
                    logger.log('Using response.data.message:', errorMessage);
                }
                // Check if response.data is a string
                else if (typeof err.response?.data === 'string') {
                    errorMessage = err.response.data;
                    logger.log('Using response.data (string):', errorMessage);
                }
                // Check if error has a message property
                else if (err.message) {
                    errorMessage = err.message;
                    logger.log('Using error.message:', errorMessage);
                }
            }
            
            logger.log('Final error message for toast:', errorMessage);
            
            // Show error toast to user
            toast({
                title: 'שגיאה',
                description: errorMessage,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'top'
            });
            
            return;
        } finally {
            setIsLocking(false);
        }
        logger.log('=== handleOrderProceed END ===');
    }, [onClose, tryLockCart, props.cart, props.cartID, toast, refreshCart, isLocking])

    return (
        <>
            <Collapse in={isOpen} animateOpacity>
                <Center>
                    <Button
                        onClick={handleOrderProceed}
                        colorScheme='yellow'
                        mt={2}
                        isLoading={isLocking}
                        loadingText="נועל עגלה..."
                        isDisabled={isLocking}
                    >
                        לביצוע ההזמנה
                    </Button>
                </Center>
            </Collapse>
            <Fade in={!isOpen}>
                <form onSubmit={createOrder}>
                    <Wrap direction='row' w='100%'>
                        <Flex direction='column' w={['100%', '100%', '60%']}>
                            <Card m={2}>
                                <FormControl as='fieldset' p={2}>
                                    <FormLabel as='legend' fontSize='xl' p={1}>
                                        שיטת משלוח
                                    </FormLabel>
                                    <RadioGroup defaultValue={shipmentMethod}
                                                onChange={(value: string) => {setShipmentMethod(value)}}>
                                        <Stack direction={['column', 'column', 'row']} spacing='8px'>
                                            <Radio value='signed_mail'>דואר רשום</Radio>
                                            <Radio value='collection_point'>נקודת איסוף</Radio>
                                            <Radio value='home_delivery'>שליח עד הבית</Radio>
                                            <Radio value='self_collect'>איסוף עצמי</Radio>
                                        </Stack>
                                    </RadioGroup>
                                    <FormHelperText>Comments about delivery</FormHelperText>
                                </FormControl>
                            </Card>
                            <Card m={2}>
                                <Heading as='h2' fontSize='xl' fontWeight='medium' p={2}>פרטי הלקוח</Heading>
                                <FormControl display='flex'
                                             flexDirection='row'
                                             p={1}
                                             alignItems='center'
                                             isRequired
                                             isInvalid={!isEmailValid}>
                                    <FormLabel display='inline-block'>דואר אלקטרוני</FormLabel>
                                    <Spacer/>
                                    <Input w='60%'
                                           value={email}
                                           onChange={(el: ChangeEvent<HTMLInputElement>) => setEmail(el.target.value)}
                                           ref={formRefs.email}/>
                                </FormControl>
                                <FormControl display='flex' flexDirection='row' p={1} alignItems='center' isRequired>
                                    <FormLabel display='inline-block'>שם פרטי</FormLabel>
                                    <Spacer/>
                                    <Input w='60%'
                                           value={firstName}
                                           onChange={(el: ChangeEvent<HTMLInputElement>) => setFirstName(el.target.value)}/>
                                </FormControl>
                                <FormControl display='flex' flexDirection='row' p={1} alignItems='center' isRequired>
                                    <FormLabel display='inline-block'>שם משפחה</FormLabel>
                                    <Spacer/>
                                    <Input w='60%'
                                           value={lastName}
                                           onChange={(el: ChangeEvent<HTMLInputElement>) => setLastName(el.target.value)}/>
                                </FormControl>
                                <FormControl display='flex'
                                             flexDirection='row'
                                             p={1}
                                             alignItems='center'
                                             isRequired
                                             isInvalid={!isPhoneValid}>
                                    <FormLabel display='inline-block'>טלפון</FormLabel>
                                    <Spacer/>
                                    <Input w='60%'
                                           value={phone}
                                           onChange={(el: ChangeEvent<HTMLInputElement>) => setPhone(el.target.value)}
                                           ref={formRefs.phone}/>
                                </FormControl>
                                <FormControl display='flex' flexDirection='row' p={1} alignItems='center' isRequired>
                                    <FormLabel display='inline-block'>יישוב</FormLabel>
                                    <Spacer/>
                                    {/* TODO: get from gov csv */}
                                    <Input w='60%'
                                           value={city}
                                           onChange={(el: ChangeEvent<HTMLInputElement>) => setCity(el.target.value)}/>
                                </FormControl>
                                <FormControl display='flex' flexDirection='row' p={1} alignItems='center' isRequired>
                                    <FormLabel display='inline-block'>רחוב</FormLabel>
                                    <Spacer/>
                                    <Input w='60%'
                                           value={street}
                                           onChange={(el: ChangeEvent<HTMLInputElement>) => setStreet(el.target.value)}/>
                                </FormControl>
                                <FormControl display='flex'
                                             flexDirection='row'
                                             p={1}
                                             alignItems='center'
                                             isRequired
                                             isInvalid={!isPostCodeValid}>
                                    <FormLabel display='inline-block'>מיקוד</FormLabel>
                                    <Spacer/>
                                    <Input w='60%'
                                           value={postCode}
                                           onChange={(el: ChangeEvent<HTMLInputElement>) => setPostCode(el.target.value)}
                                           ref={formRefs.postCode}/>
                                </FormControl>
                                <FormControl display='flex' flexDirection='row' alignItems='center' p={1}>
                                    <FormLabel display='inline-block'>מס׳ בית</FormLabel>
                                    {/* TODO: make number */}
                                    <Input w='10%'
                                           value={houseNumber}
                                           onChange={(el: ChangeEvent<HTMLInputElement>) => setHouseNumber(el.target.value)}/>
                                    <Spacer/>
                                    <FormLabel display='inline-block'>כניסה</FormLabel>
                                    <Input w='10%'
                                           value={entry}
                                           onChange={(el: ChangeEvent<HTMLInputElement>) => setEntry(el.target.value)}/>
                                    <Spacer/>
                                    <FormLabel display='inline-block'>דירה</FormLabel>
                                    {/* TODO: make number */}
                                    <Input w='10%'
                                           value={apartment}
                                           onChange={(el: ChangeEvent<HTMLInputElement>) => setApartment(el.target.value)}/>
                                </FormControl>
                            </Card>
                        </Flex>
                        <Flex direction='column' grow='1'>
                            <TableContainer>
                                <Table colorScheme='orange' size={['sm', 'sm', 'md']}>
                                    <TableCaption placement='top'>סיכום חשבון</TableCaption>
                                    <Tbody>
                                        <Tr>
                                            <Td>מוצרים</Td>
                                            <Td dir='ltr'>
                                                {props.totalPrice}
                                            </Td>
                                        </Tr>
                                        {/* TODO: add discounts */}
                                        {/*<Tr>*/}
                                        {/*    <Td>הנחה</Td>*/}
                                        {/*    <Td dir='ltr'>-200</Td>*/}
                                        {/*</Tr>*/}
                                        <Tr>
                                            <Td>משלוח</Td>
                                            <Td dir='ltr'>100</Td>
                                        </Tr>
                                    </Tbody>
                                    <Tfoot>
                                        <Tr>
                                            <Td><Text as='b'>סה"כ</Text></Td>
                                            <Td dir='ltr'><Text as='b'>{props.totalPrice + 100}</Text></Td>
                                        </Tr>
                                    </Tfoot>
                                </Table>
                            </TableContainer>
                            <Button type='submit' colorScheme='yellow' m={1}>לתשלום</Button>
                        </Flex>
                    </Wrap>
                </form>
            </Fade>
        </>
    )
}

export default CartOrder;