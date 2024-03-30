import React, {useContext} from "react";
import './TopNavbar.css';
import { BsFacebook, BsInstagram, BsBasket3, BsBookmarks, BsFillPersonFill, BsGlobe2  } from "react-icons/bs";
import {ItemType} from "./MenuItem";
import {Link as ReactLink, useNavigate} from "react-router-dom";
import {Button, Link, Menu, MenuButton, MenuList, MenuItem, useDisclosure} from "@chakra-ui/react";
import MenuSubItem from "./MenuSubItem";
import HoverMenuItem from "./HoverMenuItem";
// Potential history icon: import { BsClockHistory } from "react-icons/bs";
// Alternative to basket: import { BsFillBagFill } from "react-icons/bs";

const TopNavbar = () => {
    const navbar: ItemType[] = [
        {'name': 'home', 'link': '/', 'text': 'Home'},
        {'name': 'about', 'link': '/about', 'text': 'About'},
        {'name': 'jewelry', 'link': '/category/jewelry', 'text': 'Jewelry',
            'submenu': [
                {'name': 'earrings', 'link': '/category/jewelry/earrings', 'text': 'Earrings'},
                {'name': 'brooches', 'link': '/category/jewelry/brooches', 'text': 'Brooches'},
                {'name': 'bracelets', 'link': '/category/jewelry/bracelets', 'text': 'Bracelets'},
                {'name': 'necklaces', 'link': '/category/jewelry/necklaces', 'text': 'Necklaces'},
                {'name': 'body_jewelry', 'link': '/category/jewelry/body_jewelry', 'text': 'Body Jewelry'},
            ]
        },
    ];
    const navigate = useNavigate();

    return (
        <div className={"TopNavbarContainer"}>
            <div className="TopNavbar">
                <div className="TopNavbarActions">
                    <BsGlobe2/>{/*<!-- TODO: language & currency, insert into person -->*/}
                    <BsFillPersonFill/>
                    <BsBookmarks/>{/*<!-- TODO: insert into person -->*/}
                    <Link color="white" href="/cart"><BsBasket3/></Link>
                </div>
                <nav className="TopNavbarNav">
                    { navbar.map(item => <HoverMenuItem item={item}/>) }
                </nav>
                <div className="TopNavbarSocial">
                    <BsFacebook/>
                    <BsInstagram/>
                </div>
            </div>
        </div>
    );
}
export default TopNavbar;
