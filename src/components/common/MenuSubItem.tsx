import {MenuItem} from "@chakra-ui/react";
import React from "react";
import { ItemType } from "./MenuItem";
import {useNavigate} from "react-router-dom";

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
                  key={props.parentItem.name + '-' + props.item.name + '-item'}
                  onClick={() => {props.closeHandle(); navigate(props.item.link)}}>
            {props.item.text}
        </MenuItem>
    );
}

export default MenuSubItem;
