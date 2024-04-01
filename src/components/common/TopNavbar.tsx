import React, {useContext} from "react";
import './TopNavbar.css';
import { BsFacebook, BsInstagram, BsBasket3, BsBookmarks, BsFillPersonFill, BsGlobe2  } from "react-icons/bs";
import {ItemType} from "./MenuItem";
import {useNavigate} from "react-router-dom";
import { Link, Icon, Flex } from "@chakra-ui/react";
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
                <Flex direction='row' align='center' gap={1}>
                    <Icon boxSize={8} aria-label='Choose Language' as={BsGlobe2} color='white' />
                    <Icon boxSize={8} aria-label='Login' as={BsFillPersonFill} color='white' />
                    {/*<Icon aria-label='Wishlist' as={BsBookmarks} color='white' />*/}
                    <Link href='/cart'><Icon boxSize={8} aria-label='Cart' as={BsBasket3} color='white' /></Link>
                </Flex>
                <nav className="TopNavbarNav">
                    { navbar.map(item =>
                        <HoverMenuItem
                            key={item.name + '-item'}
                            item={item}/>) }
                </nav>
                <Flex direction='row' align='center' gap={2}>
                    <Icon boxSize={8} aria-label='Facebook Profile' as={BsFacebook} color='white' />
                    <Icon boxSize={8} aria-label='Instagram Profile' as={BsInstagram} color='white' />
                </Flex>
            </div>
        </div>
    );
}
export default TopNavbar;
