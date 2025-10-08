'use client'

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
import Select, { SingleValue } from "react-select";
import { ChangeEvent, MutableRefObject, useEffect, useRef, useState } from "react";
import { SelectOption } from "../../utils/ChakraTypes";
import axios from "axios";
import { ColumnDef, createColumnHelper, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { API_URL } from '../../utils/apiConfig';

interface OrderResponse {
    orders: Array<{
        _id: string;
        name: string;
        shipmentStep: string;
        shipmentMethod: string;
    }>;
}

export interface TOrder {
    id: string;
    customerName: string;
    orderTotal: number;
    status: string;
    paymentMethod: string;
    deliveryMethod: string;
    action: string;
}

const AdminOrders = () => {
    const [searchPhrase, setSearchPhrase] = useState('');
    const [typeFilter, setTypeFilter] =
        useState<SelectOption | null>({value: 'all', label: 'כל ההזמנות'});
    const [ordersData, setOrdersData] = useState<TOrder[]>([]);
    const api = useConst(() => axios.create({baseURL: API_URL}));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const columns: MutableRefObject<ColumnDef<TOrder, any>[]> = useRef([]);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const ordersTable = useReactTable({data: ordersData, columns: columns.current, getCoreRowModel: getCoreRowModel()});

    useEffect(() => {
        const columnHelper = createColumnHelper<TOrder>()
        columns.current = [
            columnHelper.accessor('id', {
                cell: info => info.getValue(),
                footer: info => info.column.id,
            }),
            columnHelper.accessor('customerName', {
                cell: info => <i>{info.getValue()}</i>,
                header: () => <span>Customer Name</span>,
                footer: info => info.column.id,
            }),
            columnHelper.accessor('orderTotal', {
                header: () => 'Order Total',
                cell: info => info.renderValue(),
                footer: info => info.column.id,
            }),
            columnHelper.accessor('status', {
                header: () => <span>Order Status</span>,
                footer: info => info.column.id,
            }),
            columnHelper.accessor('paymentMethod', {
                header: 'Payment Method',
                footer: info => info.column.id,
            }),
            columnHelper.accessor('deliveryMethod', {
                header: 'Delivery Method',
                footer: info => info.column.id,
            }),
            columnHelper.accessor('action', {
                header: 'Action',
                footer: info => info.column.id,
            }),
        ];
        (async () => {
            try {
                const dbOrders = await api.get<OrderResponse>('/orders');
                console.log(dbOrders);
                const orders: TOrder[] = [];
                for (const order of dbOrders.data.orders) {
                    orders.push({
                        id: order._id,
                        customerName: order.name,
                        orderTotal: 0,
                        status: order.shipmentStep,
                        paymentMethod: 'unknown',
                        deliveryMethod: order.shipmentMethod,
                        action: ''})
                }
                setOrdersData(orders);
            } catch (error) {
                console.error(error);
            }
        })();
    }, [api]);

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
            <form onSubmit={handleSearch}>
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
            </form>
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
                        { ordersData.length > 0 && ordersData.map((item: TOrder) => {
                            return (
                            <Tr key={item.id}>
                                <Td>{item.id}</Td>
                                <Td>{item.customerName}</Td>
                                <Td>${item.orderTotal}</Td>
                                <Td className="status-pending">{item.status}</Td>
                                <Td>{item.paymentMethod}</Td>
                                <Td>{item.deliveryMethod}</Td>
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
