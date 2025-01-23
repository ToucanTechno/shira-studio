import {MenuItem} from "@chakra-ui/react";
import React from "react";
import { ItemType } from "./MenuItem";
import {useNavigate} from "react-router";

interface MenuSubItemProps {
    parentItem: ItemType
    item: ItemType
    closeHandle: () => void;
}

const MenuSubItem = (props: MenuSubItemProps ) => {
    const navigate = useNavigate();

    return (
        <MenuItem bg='black'
                  color='white'
                  onClick={() => {props.closeHandle(); navigate(props.item.link)}}>
            {props.item.text}
        </MenuItem>
    );
}

export default MenuSubItem;
