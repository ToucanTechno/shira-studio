import {
    Button, Flex,
    Heading,
    Table,
    TableContainer,
    Tbody,
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
            <Table colorScheme='cyan' variant='striped'>
                <Thead>
                    <Tr>
                        <Th isNumeric>#</Th>
                        <Th>שם הקטגוריה</Th>
                        <Th>קטגוריית אב</Th>
                        <Th>פעולות</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    { categories.length > 0 && categories.map((item: ICategory) => {
                        return (
                            <Tr key={item._id}>
                                <td>{item._id}</td>
                                <td>{item.name}</td>
                                <td>{item.text}</td>
                                <td>
                                    <Button colorScheme='cyan' me={1} onClick={() => navigate(`${item._id}/edit`)}>עריכה</Button>
                                    <Button colorScheme='cyan' onClick={() => navigate(`${item._id}/delete`)}>מחיקה</Button>
                                </td>
                            </Tr>
                        )
                    })}
                </Tbody>
            </Table>
        </TableContainer>
    </Flex>)
};

export default AdminCategories;
