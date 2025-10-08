'use client'

import React, {useEffect, useState} from "react";
import './TopNavbar.css';
import { BsFacebook, BsInstagram, BsBasket3, BsFillPersonFill, BsGlobe2, BsHouseDoor  } from "react-icons/bs";
import {ItemType} from "./MenuItem";
import {Link, Icon, Flex, useConst, Box} from "@chakra-ui/react";
import HoverMenuItem from "./HoverMenuItem";
import axios from "axios";
import { Tooltip } from '@chakra-ui/react'
import { API_URL } from '@/utils/apiConfig';
// Potential history icon: import { BsClockHistory } from "react-icons/bs";
// Alternative to basket: import { BsFillBagFill } from "react-icons/bs";

const TopNavbar = () => {
    const [navbar, setNavbar] = useState<ItemType[]>([]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const api = useConst<any>(() => axios.create({baseURL: API_URL}));

    useEffect(() => {
        const navbarSkeleton: {[key: string]: ItemType} = {
               'home': {'name': 'home', 'link': '/', 'text': 'Home'},
               'about': {'name': 'about', 'link': '/about', 'text': 'About'},
        };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const promises: Promise<void | any>[] = [];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        api.get(`/categories/parent/root`).then((response: any) => {
            const topCategories = response.data;
            for (const category of topCategories) {
                navbarSkeleton[category.name] = {
                    name: category.name,
                    link: `/categories/${category.name}`,
                    text: category.text
                };
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                promises.push(api.get(`/categories/parent/${category.name}`).then((response: any) => {
                    if (response.data.length > 0) {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        navbarSkeleton[category.name]['submenu'] = response.data.map((subcategory: any) => {
                            return {
                                name: subcategory.name,
                                link: `/categories/${category.name}/${subcategory.name}`,
                                text: subcategory.text
                            };
                        });
                    }
                }));
            }
            Promise.all(promises).then(() => {
                setNavbar(Object.values(navbarSkeleton));
            });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        }).catch((error: any) => {
            // Handle any errors
            console.error(error);
        });

    }, [api]);

    return (
        <Box backgroundColor='black'>
            <Box className="TopNavbar">
                <Flex direction='row' align='center' gap={1}>
                    <Tooltip label="Home" aria-label='Home Tooltip'>
                        <Link href='/'><Icon boxSize={8} aria-label='Home' as={BsHouseDoor} color='white' /></Link>
                    </Tooltip>
                    <Tooltip label="Choose Language" aria-label='Choose Language Tooltip'>
                        {/* TODO: make it dynamic, open a popup */}
                        <Link href='/language'><Icon boxSize={8} aria-label='Choose Language' as={BsGlobe2} color='white' /></Link>
                    </Tooltip>
                    <Tooltip label="Login" aria-label='Login Tooltip'>
                        <Link href='/login'><Icon boxSize={8} aria-label='Login' as={BsFillPersonFill} color='white' /></Link>
                    </Tooltip>
                    {/*<Icon aria-label='Wishlist' as={BsBookmarks} color='white' />*/}
                    <Tooltip label="Cart" aria-label='Cart Tooltip'>
                        <Link href='/cart'><Icon boxSize={8} aria-label='Cart' as={BsBasket3} color='white' /></Link>
                    </Tooltip>
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
            </Box>
        </Box>
    );
}
export default TopNavbar;
