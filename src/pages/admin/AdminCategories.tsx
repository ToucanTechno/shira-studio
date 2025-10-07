'use client'

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
import axios from "axios";
import {ICategory} from "../../models/Product";
import { useRouter } from "next/navigation";
import AdminCategoriesAdd from "./AdminCategoriesAdd";
import Select, {SingleValue} from "react-select";
import {SelectOption} from "../../utils/ChakraTypes";

const AdminCategories = () => {
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [dirty, setDirty] = useState(false);
    const [editID, setEditID] = useState<string | null>(null);
    const [editedName, setEditedName] = useState<string>("");
    const [editedText, setEditedText] = useState<string>("");
    const [editedParent, setEditedParent] = useState<SelectOption | null>(null);
    const router = useRouter();
    const api = useConst(() => axios.create({baseURL: 'http://localhost:3001/api'}));

    useEffect(() => {
        (async () => {
            try {
                const response = await api.get('/categories');
                setCategories(response.data as ICategory[]);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (error: any) {
                console.error(error);
            }
        })();
    }, [api, dirty]);

    const handleEditCategory = async (el: FormEvent<HTMLFormElement>) => {
        console.log(el);
        // TODO: edit category when possible
        // try {
        // api.put(`/categories/${editID}`, )
        // } catch (error: any) {
        //     console.error(error);
        // }
    };

    return (<Flex flexDirection='column' alignItems='center'>
        <Heading as='h1' size='xl' mb={2}>ניהול קטגוריות</Heading>
        {/* Trick to cause table update when adding a category */}
        <AdminCategoriesAdd disabled={editID !== null} onAdd={() => setDirty(!dirty)} categories={categories} />
        <TableContainer w='100%'>
            <form onSubmit={handleEditCategory}>
                <Table colorScheme='gray' variant='striped'>
                    <Thead>
                        <Tr>
                            <Th isNumeric>#</Th>
                            <Th>שם כתובת</Th>
                            <Th>שם תצוגה</Th>
                            <Th>קטגוריית אב</Th>
                            <Th>מס׳ מוצרים</Th>
                            <Th>פעולות</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        { categories.length > 0 && categories.map((item: ICategory) => {
                            return (
                                <Tr key={item._id}>
                                    <Td py={6}>{item._id}</Td>
                                    <Td>{(editID === item._id) ?
                                        <FormControl isRequired>
                                            <Input variant='flushed'
                                                   borderColor='gray.300'
                                                   placeholder={item.name}
                                                   value={editedName}
                                                   onChange={(e) => setEditedName(e.target.value)}></Input>
                                        </FormControl> :
                                        item.name}</Td>
                                    <Td>{(editID === item._id) ?
                                        <FormControl isRequired>
                                            <Input variant='flushed'
                                                   borderColor='gray.300'
                                                   placeholder={item.text}
                                                   value={editedText}
                                                   onChange={(e) => setEditedText(e.target.value)}></Input>
                                        </FormControl> :
                                        item.text}</Td>
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
                                    <Td>{item.products?.length ?? 0}</Td>
                                    <Td>
                                        {editID === null &&
                                            <>
                                                <Button colorScheme='blackAlpha'
                                                        _hover={{'backgroundColor': 'cyan.700'}}
                                                        me={1}
                                                        size='sm'
                                                        onClick={() => {
                                                            setEditID(item._id as string);
                                                            setEditedName(item.name);
                                                            setEditedText(item.text);
                                                            setEditedParent(item.parent ? {value: item.parent, label: item.parent} : null);
                                                        }}>
                                                    עריכה
                                                </Button>
                                                <Button colorScheme='blackAlpha'
                                                        _hover={{'backgroundColor': 'red.600'}}
                                                        size='sm'
                                                        onClick={() => router.push(`${item._id}/delete`)}>
                                                    מחיקה
                                                </Button>
                                            </>
                                        }
                                        {editID === item._id &&
                                            <>
                                                <Button colorScheme='green'
                                                        me={1}
                                                        size='sm'
                                                        type='submit'>
                                                    עריכה
                                                </Button>
                                                <Button colorScheme='blackAlpha'
                                                        size='sm'
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
            </form>
        </TableContainer>
    </Flex>)
};

export default AdminCategories;
