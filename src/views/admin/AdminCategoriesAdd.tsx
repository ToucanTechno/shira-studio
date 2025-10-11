'use client'

import {
    Box,
    Button, CloseButton,
    Collapse,
    Flex,
    FormControl,
    FormLabel,
    Input, useConst,
    useDisclosure
} from "@chakra-ui/react";
import {ICategory} from "../../models/Product";
import React, {ChangeEvent, useEffect, useState} from "react";
import Select, {SingleValue} from "react-select";
import axios from "axios";
import {SelectOption} from "../../utils/ChakraTypes";
import { API_URL } from '../../utils/apiConfig';
import { logger } from '../../utils/logger';

interface CategoriesAddProps {
    categories: ICategory[];
    onAdd: () => void;
    disabled: boolean;
}

const AdminCategoriesAdd = (props: CategoriesAddProps) => {
    const { isOpen, onToggle, onClose } = useDisclosure();
    const [name, setName] =
        useState<string>("");
    const [text, setText] =
        useState<string>("");
    const [parent, setParent] =
        useState<SelectOption | null>({value: '', label: '-'})
    const api = useConst(() => axios.create({baseURL: API_URL}));

    // Close add category if starting to edit another category
    useEffect(() => {
        if (isOpen && props.disabled === true) {
            setParent({value: '', label: '-'});
            setName("");
            setText("");
            onClose();
        }
    }, [isOpen, onClose, props.disabled]);

    const handleSelectParent = (el: SingleValue<SelectOption>) => {
        setParent(el)
    };

    const handleAddCategory = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const update = {
            name: name,
            text: text,
            parent: parent?.value
        };
        logger.log("update: ", update);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        api.post('categories', update).then((res: any) => {
            logger.log(res);
            onToggle();
            props.onAdd();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        }).catch((error: any) => logger.error(error));
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
                    <form onSubmit={handleAddCategory}>
                        <Flex direction='row'>
                            <FormControl me={2}>
                                <FormLabel htmlFor='categoryName'>שם כתובת (באנגלית)</FormLabel>
                                <Input type='text'
                                       bgColor='white'
                                       name='categoryName'
                                       required
                                       value={name}
                                       onChange={(el: ChangeEvent<HTMLInputElement>) => {
                                        logger.log(el);
                                        setName(el.target.value)}}/>
                            </FormControl>
                            <FormControl me={2}>
                                <FormLabel htmlFor='categoryText'>שם תצוגה (בעברית)</FormLabel>
                                <Input type='text'
                                       bgColor='white'
                                       name='categoryText'
                                       required
                                       value={text}
                                       onChange={(el: ChangeEvent<HTMLInputElement>) => {
                                        logger.log(el);
                                        setText(el.target.value)}}/>
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
                    </form>
                </Box>
            </Collapse>
        </Box>
    )
};

export default AdminCategoriesAdd;
