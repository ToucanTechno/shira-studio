import { ItemType } from "../../components/common/MenuItem";
import React, { useContext } from "react";
import { AuthContext } from "../../services/AuthContext";
import {Box, Button, Flex } from "@chakra-ui/react";
// import {BsBasket3, BsFacebook, BsFillPersonFill, BsGlobe2, BsInstagram} from "react-icons/bs";
import HoverMenuItem from "../../components/common/HoverMenuItem";

const TopAdminNavbar = () => {
    const navbar: ItemType[] = [
        {'name': 'Statistics', 'link': '/control-panel/', 'text': 'סטטיסטיקות'},
        {'name': 'Categories', 'link': '/control-panel/categories', 'text': 'קטגוריות'},
        {'name': 'Products', 'link': '/control-panel/products', 'text': 'מוצרים'},
        {'name': 'Orders', 'link': '/control-panel/orders', 'text': 'הזמנות'},
        {'name': 'Users', 'link': '/control-panel/users', 'text': 'משתמשים'},
    ];
    const menuRefs:{[key: string] : React.RefObject<HTMLUListElement | null>} = {};

    const { callLogout } = useContext(AuthContext);

    for (const menuItem of navbar) {
        menuRefs[menuItem.name] = React.createRef();
        if (menuItem.submenu) {
            /* Only 1 level nesting currently supported */
            for (const submenuItem of menuItem.submenu) {
                menuRefs[submenuItem.name] = React.createRef();
            }
        }
    }

    return (
        <Box backgroundColor='cyan.900'>
            <Box className="TopNavbar">
                <nav className="TopNavbarNav">
                    {navbar.map(item =>
                        <HoverMenuItem
                            key={item.name + '-item'}
                            item={item}/>)}
                </nav>
                <Flex direction='row' align='center' gap={2}>
                    <Button colorScheme='whiteAlpha' onClick={callLogout}>התנתקות</Button>
                </Flex>
            </Box>
        </Box>
    );
}
export default TopAdminNavbar;
