'use client'

import React, { useEffect, useState } from "react";
import axios from 'axios'
import { IProduct, ICategory } from "../../models/Product";
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Link as ChakraLink } from '@chakra-ui/react'
import {
    Box, Flex, Image, Button, Heading,
    Table, TableContainer, Tbody, Td, Th, Thead, Tr,
    useConst
} from "@chakra-ui/react";
import Pagination from "../../components/common/Pagination";
import { API_URL } from '../../utils/apiConfig';

interface ProductData {
    total: number;
    totalPages: number;
    page: number;
    products: IProduct[];
}

const AdminProducts = () => {
    const params = useSearchParams();  // TODO: add setPage
    const productsPerPage = 10;
    const router = useRouter();
    const [products, setProducts] =
        useState<ProductData>({total: 0, totalPages: 0, page: 0, products: []});
    const api = useConst(() => axios.create({baseURL: API_URL}));

    useEffect(() => {
        const tmpPage = (params?.get('page') === null) ? 0 : parseInt(params?.get('page') as string) - 1
        const skip = tmpPage * productsPerPage;
        api.get(`/products?skip=${skip}&limit=${productsPerPage}`)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .then((response: any) => {
                // Process the response data
                const totalPages = Math.floor((response.data.total + productsPerPage - 1) / productsPerPage);
                setProducts({
                    total: response.data.total,
                    totalPages: totalPages,
                    page: tmpPage,
                    products: response.data.products
                });
            })
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .catch((error: any) => {
                // Handle any errors
                console.error(error);
            });
    }, [params, api]);

    return (<Flex flexDirection='column' alignItems='center'>
        <Heading as='h1' size='xl' mb={2}>ניהול מוצרים</Heading>
        <Box>
            <Button colorScheme='blackAlpha' _hover={{'backgroundColor': 'cyan.700'}} onClick={() => router.push('/control-panel/products/add')}>הוספת מוצר חדש</Button>
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
                                <Td>
                                    <Image
                                        boxSize='60px'
                                        src={item.images && item.images.length > 0 ? item.images[0].url : "/placeholder-image.jpg"}
                                        alt={item.images && item.images.length > 0 ? item.images[0].alt_text || item.name : item.name}
                                        objectFit="cover"
                                        borderRadius="md"
                                    />
                                </Td>
                                {/* TODO: make link work */}
                                <Td><ChakraLink as={Link} href={`/products/${item._id}`}>{item.name}</ChakraLink></Td>
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
                                    <Button colorScheme='blackAlpha' _hover={{'backgroundColor': 'cyan.700'}} me={1} onClick={() => router.push(`/control-panel/products/${item._id}/edit`)}>
                                        עריכה
                                    </Button>
                                    <Button colorScheme='blackAlpha' _hover={{'backgroundColor': 'red.600'}} onClick={() => router.push(`/control-panel/products/${item._id}/delete`)}>
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
