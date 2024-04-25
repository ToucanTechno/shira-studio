import {
    Button, Flex,
    Heading,
    Table,
    TableContainer,
    Tbody, Td,
    Th,
    Thead,
    Tr, useConst
} from "@chakra-ui/react";
import React, {useEffect, useState} from "react";
import axios, {AxiosInstance} from "axios";
import {ICategory} from "../../../backend/src/models/Category";
import {useNavigate} from "react-router-dom";

const AdminCategories = () => {
    let [page] = useState(0);  // TODO: add setPage
    const categoriesPerPage = 10;
    let [categories, setCategories]: [ICategory[], any] = useState([]);
    const navigate = useNavigate();
    const api = useConst<AxiosInstance>(() => axios.create({baseURL: 'http://localhost:3001/api'}));

    useEffect(() => {
        let skip = page * categoriesPerPage;
        api.get(`/categories?skip=${skip}&limit=${categoriesPerPage}`)
            .then(response => {
                // Process the response data
                setCategories(response.data);
            })
            .catch(error => {
                // Handle any errors
                console.error(error);
            });
    }, [page, api]);
    return (<Flex flexDirection='column' alignItems='center'>
        <Heading as='h1' size='xl' mb={2}>ניהול קטגוריות</Heading>
        <Button alignSelf='flex-start'>הוסף קטגוריה חדשה</Button>
        <TableContainer w='100%'>
            <Table colorScheme='gray' variant='striped'>
                <Thead>
                    <Tr>
                        <Th isNumeric>#</Th>
                        <Th>שם הקטגוריה</Th>
                        <Th>קטגוריית אב</Th>
                        <Th>מס׳ מוצרים</Th>
                        <Th>פעולות</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    { categories.length > 0 && categories.map((item: ICategory) => {
                        return (
                            <Tr key={item._id}>
                                <Td>{item._id}</Td>
                                <Td>{item.name}</Td>
                                <Td>{item.text}</Td>
                                <Td>{item.products.length}</Td>
                                <Td>
                                    <Button colorScheme='blackAlpha' _hover={{'backgroundColor': 'cyan.700'}} me={1} onClick={() => navigate(`${item._id}/edit`)}>
                                        עריכה
                                    </Button>
                                    <Button colorScheme='blackAlpha' _hover={{'backgroundColor': 'red.600'}} onClick={() => navigate(`${item._id}/delete`)}>
                                        מחיקה
                                    </Button>
                                </Td>
                            </Tr>
                        )
                    })}
                </Tbody>
            </Table>
        </TableContainer>
    </Flex>)
};

export default AdminCategories;
