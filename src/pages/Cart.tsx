import {
    Flex,
    Heading,
    Table,
    TableContainer,
    Tbody,
    Td,
    Tr,
    Th,
    Thead,
    Image,
    NumberInput,
    NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper
} from "@chakra-ui/react";
import React from "react";

const Cart = () => {
    const handleItemCountChange = (ev: any, ev2: any) => {
        console.log(ev, ev2)
    }
    return (<Flex direction='column' align='center'>
        <Heading as='h1'>עגלת קניות</Heading>
        <TableContainer>
            <Table colorScheme='orange' variant='simple' size='lg'>
                <Thead>
                    <Tr>
                        <Th></Th>
                        <Th>מוצר</Th>
                        <Th>מחיר</Th>
                        <Th>כמות</Th>
                        <Th>סה"כ</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    <Tr>
                        <Td><Image src='test.jpg' alt='test.jpg' /></Td>
                        <Td>אריזה, סיכת כסף 925</Td>
                        <Td>600₪</Td>
                        <Td>
                            <NumberInput onChange={handleItemCountChange} allowMouseWheel dir='ltr' size='lg' maxW={20} defaultValue={1} min={0} max={99}>
                                <NumberInputField />
                                <NumberInputStepper>
                                    <NumberIncrementStepper />
                                    <NumberDecrementStepper />
                                </NumberInputStepper>
                            </NumberInput>
                        </Td>
                        <Td>600₪</Td>
                    </Tr>
                    <Tr>
                        <Td><Image src='test.jpg' alt='test.jpg' /></Td>
                        <Td>דומם-צדפים</Td>
                        <Td>450₪</Td>
                        <Td>
                            <NumberInput onChange={handleItemCountChange} allowMouseWheel dir='ltr' size='lg' maxW={20} defaultValue={1} min={0} max={99}>
                                <NumberInputField />
                                <NumberInputStepper>
                                    <NumberIncrementStepper />
                                    <NumberDecrementStepper />
                                </NumberInputStepper>
                            </NumberInput>
                        </Td>
                        <Td>450₪</Td>
                    </Tr>
                </Tbody>
            </Table>
        </TableContainer>
    </Flex>);
};

export default Cart;
