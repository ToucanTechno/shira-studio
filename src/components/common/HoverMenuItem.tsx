import {Button, Menu, MenuButton, MenuItem, MenuList, useDisclosure} from "@chakra-ui/react";
import React, {useRef} from "react";
import { ItemType } from "./MenuItem";
import {useNavigate} from "react-router-dom";
import MenuSubItem from "./MenuSubItem";

interface HoverMenuItemProps {
    item: ItemType
}

const HoverMenuItem = (props: HoverMenuItemProps) => {
    const timerRef = useRef(0);
    const navigate = useNavigate();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const onCloseTimeout = () => {
        timerRef.current = window.setTimeout(() => {
            onClose();
        }, 150);
    }
    const onOpenClearTimeout = () => {
        if(timerRef.current !== 0) {
            clearTimeout(timerRef.current);
            timerRef.current = 0;
        }
        onOpen();
    }

    return (
        <Menu offset={[0, 0]} isOpen={isOpen}>
            <MenuButton as={Button}
                        size='lg'
                        variant='ghost'
                        border='0'
                        color='white'
                        borderRadius='0'
                        _hover={{ bg: '#333' }}
                        _active={{ bg: '#333' }}
                        onClick={() => {onClose(); navigate(props.item.link)}}
                        onMouseEnter={onOpen}
                        onMouseLeave={onCloseTimeout}>
                {props.item.text}
            </MenuButton>
            {props.item.submenu &&
                <MenuList bg='black'
                          onMouseEnter={onOpenClearTimeout}
                          onMouseLeave={onClose}
                          borderRadius='0'>
                    {props.item.submenu?.map((subItem) => {
                        return (
                            <MenuSubItem
                                key={props.item.name + '-' + subItem.name + '-item'}
                                closeHandle={onClose}
                                item={subItem}
                                parentItem={props.item}></MenuSubItem>
                        );
                    })}
                </MenuList>
            }
        </Menu>
    );
}

export default HoverMenuItem;
