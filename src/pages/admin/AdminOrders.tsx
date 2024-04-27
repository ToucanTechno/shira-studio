import {
    Box,
    Button,
    Flex,
    FormControl,
    Heading,
    IconButton,
    Input,
    Table, TableContainer,
    Tbody, Td, Th, Thead, Tr, useConst
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons"
import Select, {SingleValue} from "react-select";
import {Form} from "react-router-dom";
import {ChangeEvent, useEffect, useState} from "react";
import {SelectOption} from "../../utils/ChakraTypes";
import {IOrder} from "../../../backend/src/models/Order";
import axios, {AxiosInstance} from "axios";

const AdminOrders = () => {
    const [searchPhrase, setSearchPhrase] = useState('');
    const [typeFilter, setTypeFilter] =
        useState<SelectOption | null>({value: 'all', label: 'כל ההזמנות'});
    const [orders, setOrders] = useState<IOrder[]>([]);
    const api = useConst<AxiosInstance>(() => axios.create({baseURL: 'http://localhost:3001/api'}));

    useEffect(() => {
        api.get('/orders');
    }, []);

    const handleSelectTypeFilter = (el: SingleValue<SelectOption>) => {
        setTypeFilter(el)
    };

    const handleSearch = () => {
        console.log('handling search: ', searchPhrase)
    };
    // searchInput.addEventListener('input', applyFilters);
    // statusFilter.addEventListener('change', applyFilters);
    return (
        <Flex direction='column'>
            <Heading as='h1'>ניהול הזמנות</Heading>
            <Box w='300px'>
            <Form onSubmit={handleSearch}>
                <FormControl m={2}>
                    <Flex>
                        <Input type='text'
                               value={searchPhrase}
                               onChange={(el: ChangeEvent<HTMLInputElement>) => {
                                   setSearchPhrase(el.target.value);
                               }}
                               name='search'
                               placeholder='Order ID or Customer Name'
                               me={2}/>
                        <IconButton aria-label='Search Order' icon={<SearchIcon />} />
                    </Flex>
                </FormControl>
                <FormControl m={2}>
                    <Select name='statusFilter'
                            isSearchable
                            onChange={handleSelectTypeFilter}
                            value={typeFilter}
                            options={[
                                {label: 'כל ההזמנות', value: 'all'},
                                {label: 'ממתין לטיפול', value: 'pending'},
                                {label: 'נשלח', value: 'shipped'},
                                {label: 'הגיע ליעדו', value: 'delivered'}]} />
                </FormControl>
            </Form>
            </Box>
            <TableContainer>
                <Table>
                    <Thead>
                        <Tr>
                            <Th>מספר הזמנה</Th>
                            <Th>שם לקוח</Th>
                            <Th>סכום הזמנה</Th>
                            <Th>סטטוס</Th>
                            <Th>צורת תשלום</Th>
                            <Th>צורת משלוח</Th>
                            <Th>פעולות</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        { orders.length > 0 && orders.map((item: IOrder) => {
                            console.log(item)
                            return (
                            <Tr>
                                <Td>1001</Td>
                                <Td>John Doe</Td>
                                <Td>$250</Td>
                                <Td className="status-pending">Pending</Td>
                                <Td>Paid</Td>
                                <Td>Shipping</Td>
                                <Td>
                                    <Button me={2}>צפייה בהזמנה</Button>
                                    <Button>סימון כנשלח</Button>
                                </Td>
                            </Tr>
                            );
                        })}
                    </Tbody>
                </Table>
            </TableContainer>
        </Flex>
    )
};

export default AdminOrders;
