import React, {useEffect, useState} from "react";
import axios, {AxiosInstance} from 'axios'
import {IProduct} from "../../models/Product";
import { Link as ReactRouterLink, useNavigate } from 'react-router-dom'
import { Link as ChakraLink } from '@chakra-ui/react'
import {
    Box,
    Button,
    Flex,
    Heading,
    Image,
    Table,
    TableContainer,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
    useConst
} from "@chakra-ui/react";
import {ICategory} from "../../../backend/src/models/Category";

const AdminProducts = () => {
    let [page] = useState(0);  // TODO: add setPage
    const productsPerPage = 10;
    const navigate = useNavigate();
    let [products, setProducts]: [IProduct[], any] = useState([]);
    const api = useConst<AxiosInstance>(() => axios.create({baseURL: 'http://localhost:3001/api'}));

    useEffect(() => {
        let skip = page * productsPerPage;
        api.get(`/products?skip=${skip}&limit=${productsPerPage}`)
            .then(response => {
                // Process the response data
                console.log(response.data);
                setProducts(response.data.products);
            })
            .catch(error => {
                // Handle any errors
                console.error(error);
            });
    }, [page, api]);
    return (<Flex flexDirection='column' alignItems='center'>
        <Heading as='h1' size='xl' mb={2}>ניהול מוצרים</Heading>
        <Box>
            <Button onClick={() => navigate('/control-panel/products/add')}>הוספת מוצר חדש</Button>
        </Box>
        <TableContainer w='100%'>
            <Table colorScheme='gray' variant='striped'>
                <Thead>
                    <Tr>
                        <Th>תמונה</Th>
                        <Th>שם המוצר</Th>
                        <Th>מק"ט</Th>
                        <Th>מלאי</Th>
                        <Th isNumeric>מחיר</Th>
                        <Th>קטגוריות</Th>
                        <Th>תאריך הוספה</Th>
                        <Th>תאריך שינוי</Th>
                        <Th>תיאור המוצר</Th>{/* TODO: move to line hover */}
                        <Th>צפיות</Th>
                        <Th>פעולות</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    { products.length > 0 && products.map((item: IProduct) => {
                        return (
                            <Tr key={item._id}>
                                <Td><Image boxSize='60px' src="necklace.jpg" alt="Gold Necklace"/></Td>
                                {/* TODO: make link work */}
                                <Td><ChakraLink as={ReactRouterLink} to={`/products/${item._id}`}>{item.name}</ChakraLink></Td>
                                <Td>{item._id}</Td>
                                <Td color={(item.stock === 0) ? 'red.400' : 'green.400'}>{item.stock}</Td>
                                <Td isNumeric>
                                    {new Intl.NumberFormat('he-il', {minimumFractionDigits: 2}).format(item.price)}
                                </Td>
                                <Td>{(item.categories) ? item.categories.map((cat) => {
                                    console.log(cat); return (cat as ICategory).text;
                                }) : []}</Td>
                                <Td>{item.created?.toString()}</Td>
                                <Td>{item.modified?.toString()}</Td>
                                {/* TODO: what if description is too long? Create a hover */}
                                <Td>{item.description}</Td>
                                <Td>{item.views}</Td>
                                <Td>
                                    <Button colorScheme='blackAlpha' me={1} onClick={() => navigate(`${item._id}/edit`)}>
                                        עריכה
                                    </Button>
                                    <Button colorScheme='blackAlpha' onClick={() => navigate(`${item._id}/delete`)}>
                                        מחיקה
                                    </Button>
                                </Td>
                            </Tr>
                        )})}
                </Tbody>
            </Table>
        </TableContainer>
    </Flex>)
};

export default AdminProducts;
