import {
    Box,
    Button, CloseButton,
    Collapse,
    Flex,
    FormControl,
    FormLabel,
    Input, ScaleFade, useConst,
    useDisclosure
} from "@chakra-ui/react";
import {ICategory} from "../../../backend/src/models/Category";
import React, {useEffect, useRef, useState} from "react";
import {Form} from "react-router-dom";
import Select, {SingleValue} from "react-select";
import axios, {AxiosInstance} from "axios";
import {SelectOption} from "../../utils/ChakraTypes";

interface CategoriesAddProps {
    categories: ICategory[];
    onAdd: () => void;
    disabled: boolean;
}

const AdminCategoriesAdd = (props: CategoriesAddProps) => {
    const { isOpen, onToggle, onClose } = useDisclosure();
    const [name, setName] =
        useState<string | undefined>();
    const [parent, setParent] =
        useState<SelectOption | null>({value: '', label: '-'})
    const categoryRefs = {
        name: useRef<HTMLInputElement>(null),
    }
    const api = useConst<AxiosInstance>(() => axios.create({baseURL: 'http://localhost:3001/api'}));

    // Close add category if starting to edit another category
    useEffect(() => {
        if (isOpen && props.disabled == true) {
            setParent({value: '', label: '-'});
            setName(undefined);
            onClose();
        }
    }, [props.disabled]);

    const handleSelectParent = (el: SingleValue<SelectOption>) => {
        setParent(el)
    };

    const handleAddCategory = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        let update = {
            name: categoryRefs.name.current?.value,
            parent: parent?.value
        };
        console.log("update: ", update);
        api.post('categories', update).then(res => {
            console.log(res);
            onToggle();
            props.onAdd();
        }).catch(error => console.error(error));
    }

    return (
        <Box mx='2' alignSelf='flex-start'>
            <Collapse in={!isOpen}
                      transition={{ exit: { duration: .5 }, enter: { duration: .5 } }}>
                <Button colorScheme='blackAlpha' isDisabled={props.disabled} onClick={onToggle}>הוספת קטגוריה חדשה</Button>
            </Collapse>
            <Collapse in={isOpen}
                       transition={{ exit: { delay: .5, duration: .5 }, enter: { delay: .5, duration: .5 } }}
                       style={{overflow: 'visible'}}>
                <Box my='2' p='2' bg='gray.100' rounded='md'>
                    <Form onSubmit={handleAddCategory}>
                        <Flex direction='row'>
                            <FormControl me={2}>
                                <FormLabel htmlFor='categoryName'>שם הקטגוריה</FormLabel>
                                <Input type='text'
                                       bgColor='white'
                                       name='categoryName'
                                       required
                                       value={name}/>
                            </FormControl>
                            <FormControl me={5}>
                                <FormLabel htmlFor='parent'>קטגוריית אב</FormLabel>
                                <Select name='parent'
                                        isSearchable
                                        onChange={handleSelectParent}
                                        value={parent}
                                        options={props.categories.map(cat =>
                                            ({label: cat.name, value: cat.name})
                                        ).concat([{value: '', label: '-'}])} />
                            </FormControl>
                            <Button colorScheme='green'
                                    type='submit'
                                    bgColor='green.600'
                                    mb={1}
                                    px={5}
                                    size='sm'
                                    alignSelf='flex-end'>
                                הוספה
                            </Button>
                            <CloseButton onClick={onToggle}/>
                        </Flex>
                    </Form>
                </Box>
            </Collapse>
        </Box>
    )
};

export default AdminCategoriesAdd;
