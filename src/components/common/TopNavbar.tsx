import React, {useEffect, useState} from "react";
import './TopNavbar.css';
import { BsFacebook, BsInstagram, BsBasket3, BsBookmarks, BsFillPersonFill, BsGlobe2  } from "react-icons/bs";
import {ItemType} from "./MenuItem";
import {useNavigate} from "react-router-dom";
import {Link, Icon, Flex, useConst, Box} from "@chakra-ui/react";
import HoverMenuItem from "./HoverMenuItem";
import axios, {AxiosInstance, AxiosResponse} from "axios";
// Potential history icon: import { BsClockHistory } from "react-icons/bs";
// Alternative to basket: import { BsFillBagFill } from "react-icons/bs";

const TopNavbar = () => {
    const [navbar, setNavbar] = useState<ItemType[]>([]);
    const navigate = useNavigate();
    const api = useConst<AxiosInstance>(() => axios.create({baseURL: 'http://localhost:3001/api'}));

    useEffect(() => {
        let navbarSkeleton: {[key: string]: ItemType} = {
               'home': {'name': 'home', 'link': '/', 'text': 'Home'},
               'about': {'name': 'about', 'link': '/about', 'text': 'About'},
        };
        let promises: Promise<void | AxiosResponse<any, any>>[] = [];
        api.get(`/categories/parent/root`).then((response: any) => {
            let topCategories = response.data;
            for (let category of topCategories) {
                navbarSkeleton[category.name] = {
                    name: category.name,
                    link: `/categories/${category.name}`,
                    text: category.text
                };
                promises.push(api.get(`/categories/parent/${category.name}`).then((response) => {
                    if (response.data.length > 0) {
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
        }).catch((error: any) => {
            // Handle any errors
            console.error(error);
        });

    }, []);

    return (
        <Box backgroundColor='black'>
            <Box className="TopNavbar">
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
            </Box>
        </Box>
    );
}
export default TopNavbar;
