import React, { useEffect, useState } from "react";
import axios, { AxiosInstance } from 'axios'
import { IProduct } from "../../models/Product";
import { Link as ReactRouterLink, useNavigate, useSearchParams } from 'react-router'
import { Link as ChakraLink } from '@chakra-ui/react'
import {
    Box, Flex, Image, Button, Heading,
    Table, TableContainer, Tbody, Td, Th, Thead, Tr,
    useConst
} from "@chakra-ui/react";
import {ICategory} from "../../../backend/src/models/Category";
import Pagination from "../../components/common/Pagination";

interface ProductData {
    total: number;
    totalPages: number;
    page: number;
    products: IProduct[];
}

const AdminProducts = () => {
    let [params] = useSearchParams();  // TODO: add setPage
    const productsPerPage = 10;
    const navigate = useNavigate();
    let [products, setProducts] =
        useState<ProductData>({total: 0, totalPages: 0, page: 0, products: []});
    const api = useConst<AxiosInstance>(() => axios.create({baseURL: 'http://localhost:3001/api'}));

    useEffect(() => {
        const tmpPage = (params.get('page') === null) ? 0 : parseInt(params.get('page') as string) - 1
        let skip = tmpPage * productsPerPage;
        api.get(`/products?skip=${skip}&limit=${productsPerPage}`)
            .then(response => {
                // Process the response data
                const totalPages = Math.floor((response.data.total + productsPerPage - 1) / productsPerPage);
                setProducts({
                    total: response.data.total,
                    totalPages: totalPages,
                    page: tmpPage,
                    products: response.data.products
                });
            })
            .catch(error => {
                // Handle any errors
                console.error(error);
            });
    }, [params, api]);

    return (<Flex flexDirection='column' alignItems='center'>
        <Heading as='h1' size='xl' mb={2}>ניהול מוצרים</Heading>
        <Box>
            <Button colorScheme='blackAlpha' _hover={{'backgroundColor': 'cyan.700'}} onClick={() => navigate('/control-panel/products/add')}>הוספת מוצר חדש</Button>
        </Box>
        <TableContainer w='100%'>
            <Table colorScheme='gray' variant='striped' size='sm'>
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
                    { products.products.length > 0 && products.products.map((item: IProduct) => {
                        return (
                            <Tr key={item._id}>
                                <Td><Image boxSize='60px' src="necklace.jpg" alt="Gold Necklace"/></Td>
                                {/* TODO: make link work */}
                                <Td><ChakraLink as={ReactRouterLink} to={`/products/${item._id}`}>{item.name}</ChakraLink></Td>
                                <Td dir='ltr'>...{(item._id as string).slice(-6)}</Td>
                                <Td color={(item.stock === 0) ? 'red.400' : 'green.400'}>{item.stock}</Td>
                                <Td isNumeric>
                                    {new Intl.NumberFormat('he-il', {minimumFractionDigits: 2}).format(item.price)}
                                </Td>
                                <Td>{(item.categories) ? item.categories.map((cat) => {
                                    return (cat as ICategory).text;
                                }).toString() : []}</Td>
                                <Td>{item.created?.toString()}</Td>
                                <Td>{item.modified?.toString()}</Td>
                                {/* TODO: what if description is too long? Create a hover */}
                                <Td>{item.description}</Td>
                                <Td>{item.views}</Td>
                                <Td>
                                    <Button colorScheme='blackAlpha' _hover={{'backgroundColor': 'cyan.700'}} me={1} onClick={() => navigate(`${item._id}/edit`)}>
                                        עריכה
                                    </Button>
                                    <Button colorScheme='blackAlpha' _hover={{'backgroundColor': 'red.600'}} onClick={() => navigate(`${item._id}/delete`)}>
                                        מחיקה
                                    </Button>
                                </Td>
                            </Tr>
                        )})}
                </Tbody>
            </Table>
        </TableContainer>
        <Pagination page={products.page} totalPages={products.totalPages} />
    </Flex>)
};

export default AdminProducts;
