import {
    Button, Card, Center, Collapse, Fade,
    Flex, FormControl, FormHelperText, FormLabel, Heading, Input, Radio, RadioGroup, Spacer,
    Stack, Table, TableCaption, TableContainer, Tbody, Td, Text, Tfoot, Tr, useDisclosure,
    Wrap
} from "@chakra-ui/react";
import React, {
    ChangeEvent, Dispatch, FormEvent, useCallback, useContext, useEffect, useMemo, useRef, useState
} from "react";
import {Form, useBlocker} from "react-router-dom";
import {AuthContext} from "../services/AuthContext";
import {ICartModel} from "../models/CartModel";
import {CartContext} from "../services/CartContext";

interface CartOrderProps {
    totalPrice: number;
    cartID: string | null;
    cart: ICartModel | null;
    setCart: Dispatch<ICartModel | null>;
}

const CartOrder = (props: CartOrderProps) => {
    // TODO: need to save isOpen and the form details (encrypted in some way) in local storage
    const { isOpen, onClose} = useDisclosure({ defaultIsOpen: true })
    const [email, setEmail] = useState<string>('');
    const isEmailValid = useMemo(() =>
        (email === '' || email.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/) !== null), [email])
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [phone, setPhone] = useState<string>('');
    const isPhoneValid = useMemo(() =>
        (phone === '' || phone.replace(/-/g, '').match(/^(\+|00)?[0-9]{8,15}$/) !== null),
        [phone])
    const [city, setCity] = useState<string>('');
    const [street, setStreet] = useState<string>('');
    const [postCode, setPostCode] = useState<string>('');
    const isPostCodeValid = useMemo(() =>
        (postCode === '' || postCode.match(/^[0-9]{5}([0-9]{2})?$/) !== null), [postCode])
    const [houseNumber, setHouseNumber] = useState<string>('');
    const [entry, setEntry] = useState<string>('');
    const [apartment, setApartment] = useState<string>('');
    const { api } = useContext(AuthContext)
    const { tryLockCart } = useContext(CartContext);
    const formRefs = {
        email: useRef<HTMLInputElement>(null),
        phone: useRef<HTMLInputElement>(null),
        postCode: useRef<HTMLInputElement>(null)
    }
    let blocker = useBlocker(
        ({ currentLocation, nextLocation }) =>
            props.cartID !== null && props.cart !== null && currentLocation.pathname !== nextLocation.pathname
    );

    useEffect(() => {
        // TODO: && blocker.location.pathname !== 'checkout'
        console.log('blocked:', blocker);
        if (blocker.state === 'blocked') {
            tryLockCart((props.cart as ICartModel).lock, false).then(() => {
                if (blocker.state === 'blocked') {
                    blocker.proceed();
                }
            }).catch((error) => console.error(error));
        }
    }, [blocker, tryLockCart, props.cart])

    const createOrder = (ev: FormEvent<HTMLFormElement>) => {
        ev.preventDefault();
        if (props.cartID === null) {
            console.error('missing cart ID');
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
        console.log(ev);
        // TODO: lock cart if unlocked
        // TODO: test added / removed amounts when cart is locked
        api.post('/orders', {
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
            comments: 'TODO'
        }).then(res => {
            console.log(`Order ID: ${res.data}`);
        }).catch(error => console.error(error));
    };

    const handleOrderProceed = useCallback(async () => {
        if (props.cart === null) {
            // TODO: try create cart?
            console.error('null cart');
            return;
        }
        onClose();
        try {
            await tryLockCart(props.cart.lock, true);
        } catch(error) {
            console.error(error);
            return;
        }
    }, [onClose, tryLockCart, props.cart])

    return (
        <>
            <Collapse in={isOpen} animateOpacity>
                <Center>
                    <Button onClick={handleOrderProceed} colorScheme='yellow' mt={2}>לביצוע ההזמנה</Button>
                </Center>
            </Collapse>
            <Fade in={!isOpen}>
                <Form onSubmit={createOrder}>
                    <Wrap direction='row' w='100%'>
                        <Flex direction='column' w={['100%', '100%', '60%']}>
                            <Card m={2}>
                                <FormControl as='fieldset' p={2}>
                                    <FormLabel as='legend' fontSize='xl' p={1}>
                                        שיטת משלוח
                                    </FormLabel>
                                    <RadioGroup>
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
                </Form>
            </Fade>
        </>
    )
}

export default CartOrder;
