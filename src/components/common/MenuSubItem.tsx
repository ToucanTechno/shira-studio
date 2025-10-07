'use client'

import {MenuItem} from "@chakra-ui/react";
import React from "react";
import { ItemType } from "./MenuItem";
import { useRouter } from "next/navigation";

interface MenuSubItemProps {
    parentItem: ItemType
    item: ItemType
    closeHandle: () => void;
}

const MenuSubItem = (props: MenuSubItemProps ) => {
    const router = useRouter();

    return (
        <MenuItem bg='black'
                  color='white'
                  onClick={() => {props.closeHandle(); router.push(props.item.link)}}>
            {props.item.text}
        </MenuItem>
    );
}

export default MenuSubItem;