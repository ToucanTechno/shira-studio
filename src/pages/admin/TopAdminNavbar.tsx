import MenuItem, {ItemType} from "../../components/common/MenuItem";
import React, {useContext} from "react";
import {AuthContext} from "../../services/AuthContext";

const TopAdminNavbar = () => {
    const navbar: ItemType[] = [
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
        <div className={"TopNavbarContainer adminNavbar"}>
            <div className="TopNavbar">
                <nav className="TopNavbarNav">
                    <ul className="TopNavbarList">
                        {navbar.map(item => {
                            return <MenuItem key={item.name + '-item'} item={item} menuRefs={menuRefs} />
                        })}
                    </ul>
                </nav>
                    <div className="TopNavbarSide">
                        <button onClick={callLogout}>התנתקות</button>
                    </div>
            </div>
        </div>
    );
}
export default TopAdminNavbar;
