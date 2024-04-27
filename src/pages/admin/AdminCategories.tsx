import {
    Button, Flex, FormControl,
    Heading, Input,
    Table,
    TableContainer,
    Tbody, Td,
    Th,
    Thead,
    Tr, useConst
} from "@chakra-ui/react";
import React, {FormEvent, useEffect, useState} from "react";
import axios, {AxiosInstance} from "axios";
import {ICategory} from "../../../backend/src/models/Category";
import {Form, useNavigate} from "react-router-dom";
import AdminCategoriesAdd from "./AdminCategoriesAdd";
import Select, {SingleValue} from "react-select";
import {SelectOption} from "../../utils/ChakraTypes";

const AdminCategories = () => {
    let [categories, setCategories] = useState<ICategory[]>([]);
    let [dirty, setDirty] = useState(false);
    let [editID, setEditID] = useState<string | null>(null);
    let [editedName, setEditedName] = useState<string | undefined>();
    let [editedParent, setEditedParent] = useState<SelectOption | null>(null);
    const navigate = useNavigate();
    const api = useConst<AxiosInstance>(() => axios.create({baseURL: 'http://localhost:3001/api'}));

    useEffect(() => {
        api.get('/categories')
            .then(response => {
                // Process the response data
                setCategories(response.data);
            })
            .catch(error => {
                // Handle any errors
                console.error(error);
            });
    }, [api, dirty]);

    const handleEditCategory = (el: FormEvent<HTMLFormElement>) => {
        console.log(el);
        // TODO: edit category when possible
        // api.put(`/categories/${editID}`, {
        //     a
        // });
    };

    return (<Flex flexDirection='column' alignItems='center'>
        <Heading as='h1' size='xl' mb={2}>ניהול קטגוריות</Heading>
        {/* Trick to cause table update when adding a category */}
        <AdminCategoriesAdd disabled={editID !== null} onAdd={() => setDirty(!dirty)} categories={categories} />
        <TableContainer w='100%'>
            <Form onSubmit={handleEditCategory}>
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
                                    <Td>{(editID === item._id) ?
                                        // eslint-disable-next-line react/jsx-no-undef
                                        <FormControl isRequired>
                                            <Input variant='flushed'
                                                   borderColor='gray.300'
                                                   placeholder={item.name}
                                                   value={editedName}></Input>
                                        </FormControl> :
                                        item.name}</Td>
                                    <Td>{(editID === item._id) ?
                                        <FormControl isRequired>
                                            <Select
                                                isSearchable
                                                onChange={(el: SingleValue<SelectOption>) => setEditedParent(el)}
                                                value={editedParent}
                                                options={categories.map(cat =>
                                                    ({label: cat.name, value: cat.name})
                                                ).concat([{value: '', label: '-'}])} />
                                        </FormControl> :
                                        item.parent}</Td>
                                    <Td>{item.products.length}</Td>
                                    <Td>
                                        {editID === null &&
                                            <>
                                                <Button colorScheme='blackAlpha'
                                                        _hover={{'backgroundColor': 'cyan.700'}}
                                                        me={1}
                                                        onClick={() => setEditID(item._id as string)}>
                                                    עריכה
                                                </Button>
                                                <Button colorScheme='blackAlpha'
                                                        _hover={{'backgroundColor': 'red.600'}}
                                                        onClick={() => navigate(`${item._id}/delete`)}>
                                                    מחיקה
                                                </Button>
                                            </>
                                        }
                                        {editID === item._id &&
                                            <>
                                                <Button colorScheme='green'
                                                        me={1}
                                                        type='submit'>
                                                    עריכה
                                                </Button>
                                                <Button colorScheme='blackAlpha'
                                                        onClick={() => setEditID(null)}>
                                                    ביטול
                                                </Button>
                                            </>
                                        }
                                    </Td>
                                </Tr>
                            )
                        })}
                    </Tbody>
                </Table>
            </Form>
        </TableContainer>
    </Flex>)
};

export default AdminCategories;
