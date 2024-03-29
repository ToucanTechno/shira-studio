import React, {useContext} from "react";
import './TopNavbar.css';
import { BsFacebook, BsInstagram, BsBasket3, BsBookmarks, BsFillPersonFill, BsGlobe2  } from "react-icons/bs";
import MenuItem, {ItemType} from "./MenuItem";
import {AuthContext} from "../../services/AuthContext";
import {Link} from "react-router-dom";
// Potential history icon: import { BsClockHistory } from "react-icons/bs";
// Alternative to basket: import { BsFillBagFill } from "react-icons/bs";

const TopNavbar = ({ isAdmin, logoutCallback }: { isAdmin?: boolean, logoutCallback?: () => void}) => {
    const navbar: ItemType[] = (!isAdmin) ? [
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
    ] : [
        {'name': 'Statistics', 'link': '/control-panel/', 'text': 'סטטיסטיקות'},
        {'name': 'Categories', 'link': '/control-panel/categories', 'text': 'קטגוריות'},
        {'name': 'Products', 'link': '/control-panel/products', 'text': 'מוצרים'},
        {'name': 'Orders', 'link': '/control-panel/orders', 'text': 'הזמנות'},
        {'name': 'Users', 'link': '/control-panel/users', 'text': 'משתמשים'},
    ];
    let menuRefs:{[key: string] : React.RefObject<HTMLUListElement>} = {};

    const { callLogout } = useContext(AuthContext);

    for (let menuItem of navbar) {
        menuRefs[menuItem.name] = React.createRef();
        if (menuItem.submenu) {
            /* Only 1 level nesting currently supported */
            for (let submenuItem of menuItem.submenu) {
                menuRefs[submenuItem.name] = React.createRef();
            }
        }
    }

    return (
        <div className={(isAdmin) ? "TopNavbarContainer adminNavbar" : "TopNavbarContainer"}>
            <div className="TopNavbar">
                {!isAdmin &&
                <div className="TopNavbarActions">
                    <BsGlobe2/>{/*<!-- TODO: language & currency, insert into person -->*/}
                    <BsFillPersonFill/>
                    <BsBookmarks/>{/*<!-- TODO: insert into person -->*/}
                    <Link to="/cart"><BsBasket3/></Link>
                </div>
                }
                <nav className="TopNavbarNav">
                    <ul className="TopNavbarList">
                        {navbar.map(item => {
                            return <MenuItem key={item.name + '-item'} item={item} menuRefs={menuRefs} />
                        })}
                    </ul>
                </nav>
                {(isAdmin) ?
                    <div className="TopNavbarSide">
                        <button onClick={callLogout}>התנתקות</button>
                    </div>
                    :
                    <div className="TopNavbarSocial">
                        <BsFacebook/>
                        <BsInstagram/>
                    </div>
                }
            </div>
        </div>
    );
}
export default TopNavbar;
