import {
    Flex, Heading,
    Table, TableContainer, Tbody, Td, Tr, Th, Thead,
    Image,
    NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper, TableCaption,
    Text, Card, Wrap, Spacer, FormControl, FormLabel, RadioGroup, Radio, FormHelperText, Stack, Input,
    Tfoot, Button, CloseButton, useConst
} from "@chakra-ui/react";
import React, {useContext, useEffect, useState} from "react";
import axios, {AxiosInstance} from "axios";
import {AuthContext} from "../services/AuthContext";
import {ICartModel} from "../models/CartModel";

const Cart = () => {
    const [cart, setCart] = useState<ICartModel | null>(null);
    const api = useConst<AxiosInstance>(() => axios.create({baseURL: 'http://localhost:3001/api'}));
    const { guestData, setGuestData} = useContext(AuthContext)

    useEffect(() => {
        if (guestData.cartID) {
            api.get(`/cart/${guestData.cartID}`).then(response => {
                console.log(response.data)
                setCart(response.data);
            }).catch(error => {
                console.log("error:", error);
            })
        }
    }, [guestData]);
    const handleItemCountChange = (inputName: string, strVal: string, val: number) => {
        console.log(inputName, strVal, val);
    }
    return (
        <Flex direction='column' align='center' w={['100%','100%', '80%']} alignSelf='center'>
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
                        {cart && Object.keys(cart.products).map(cartKey => {
                            let item = cart.products[cartKey];
                            console.log(cartKey, 'item', item);
                            return (
                                <Tr key={item.product._id}>
                                    <Td><Image src='test.jpg' alt='test.jpg' /></Td>
                                    <Td>{item.product.name}</Td>
                                    <Td>{item.product.price}₪</Td>
                                    <Td>
                                        {/* TODO: on blue ask user whether to remove item */}
                                        <NumberInput name='amount'
                                                     value={cart.products[cartKey].amount}
                                                     onChange={(_, val) => {
                                                         cart.products[cartKey].amount = val;
                                                         setCart({...cart, products: cart.products});
                                                     }}
                                                     allowMouseWheel
                                                     dir='ltr'
                                                     size='sm'
                                                     w={16}
                                                     min={0}
                                                     max={99}>
                                            <NumberInputField />
                                            <NumberInputStepper>
                                                <NumberIncrementStepper />
                                                <NumberDecrementStepper />
                                            </NumberInputStepper>
                                        </NumberInput>
                                    </Td>
                                    <Td><CloseButton/></Td>
                                </Tr>
                            );
                        })}
                    </Tbody>
                </Table>
            </TableContainer>
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
                        <FormControl isRequired>
                            <Flex direction='row' m={1} align='baseline'>
                                <FormLabel display='inline-block'>דואר אלקטרוני</FormLabel>
                                <Spacer/>
                                <Input w='60%'/>
                            </Flex>
                            <Flex direction='row' m={1} align='baseline'>
                                <FormLabel display='inline-block'>שם פרטי</FormLabel>
                                <Spacer/>
                                <Input w='60%'/>
                            </Flex>
                            <Flex direction='row' m={1} align='baseline'>
                                <FormLabel display='inline-block'>שם משפחה</FormLabel>
                                <Spacer/>
                                <Input w='60%'/>
                            </Flex>
                            <Flex direction='row' m={1} align='baseline'>
                                <FormLabel display='inline-block'>טלפון</FormLabel>
                                <Spacer/>
                                <Input w='60%'/>
                            </Flex>
                            <Flex direction='row' m={1} align='baseline'>
                                <FormLabel display='inline-block'>יישוב</FormLabel>
                                <Spacer/>
                                <Input w='60%'/>
                            </Flex>
                            <Flex direction='row' m={1} align='baseline'>
                                <FormLabel display='inline-block'>רחוב</FormLabel>
                                <Spacer/>
                                <Input w='60%'/>
                            </Flex>
                            <Flex direction='row' m={1} align='baseline'>
                                <FormLabel display='inline-block'>מיקוד</FormLabel>
                                <Spacer/>
                                <Input w='60%'/>
                            </Flex>
                            <Flex direction='row' m={1} align='baseline'>
                                <FormLabel display='inline-block'>בית</FormLabel>
                                <Input w='10%'/>
                                <Spacer/>
                                <FormLabel display='inline-block'>כניסה</FormLabel>
                                <Input w='10%'/>
                                <Spacer/>
                                <FormLabel display='inline-block'>דירה</FormLabel>
                                <Input w='10%'/>
                            </Flex>
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
                                    <Td dir='ltr'>1000</Td>
                                </Tr>
                                <Tr>
                                    <Td>הנחה</Td>
                                    <Td dir='ltr'>-200</Td>
                                </Tr>
                                <Tr>
                                    <Td>משלוח</Td>
                                    <Td dir='ltr'>100</Td>
                                </Tr>
                            </Tbody>
                            <Tfoot>
                                <Tr>
                                    <Td><Text as='b'>סה"כ</Text></Td>
                                    <Td dir='ltr'><Text as='b'>900</Text></Td>
                                </Tr>
                            </Tfoot>
                        </Table>
                    </TableContainer>
                    <Button colorScheme='yellow' m={1}>המשך לתשלום</Button>
                </Flex>
            </Wrap>
        </Flex>
    );
};

export default Cart;
