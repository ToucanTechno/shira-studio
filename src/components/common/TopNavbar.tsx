import React, {Component} from "react";
import './TopNavbar.css';
import { BsFacebook, BsInstagram, BsBasket3, BsBookmarks, BsFillPersonFill, BsGlobe2  } from "react-icons/bs";
import MenuItem, {ItemType} from "./MenuItem";
// Potential history icon: import { BsClockHistory } from "react-icons/bs";
// Alternative to basket: import { BsFillBagFill } from "react-icons/bs";

class TopNavbar extends Component {
    private readonly navbar: ItemType[] = [
        {'name': 'home', 'link': '/', 'text': 'Home'},
        {'name': 'about', 'link': '/about', 'text': 'About',
            'submenu': [
                {'name': 'earrings', 'link': '/earrings', 'text': 'Earrings'},
                {'name': 'brooches', 'link': '/brooches', 'text': 'Brooches'},
            ]
        },
    ];

    private menuRefs:{[key: string] : React.RefObject<HTMLUListElement>} = {};

    constructor(props: any) {
        super(props);
        for (let menuItem of this.navbar) {
            this.menuRefs[menuItem.name] = React.createRef();
            if (menuItem.submenu) {
                /* Only 1 level nesting currently supported */
                for (let submenuItem of menuItem.submenu) {
                    this.menuRefs[submenuItem.name] = React.createRef();
                }
            }
        }
    }

    render() {
        return (
            <div className="TopNavbarContainer">
                <div className="TopNavbar">
                    <div className="TopNavbarActions">
                        <BsGlobe2/>{/*<!-- TODO: language & currency, insert into person -->*/}
                        <BsFillPersonFill/>
                        <BsBookmarks/>{/*<!-- TODO: insert into person -->*/}
                        <BsBasket3/>
                    </div>
                    <nav className="TopNavbarNav">
                        <ul className="TopNavbarList">
                            {this.navbar.map(item => {
                                return <MenuItem key={item.name + '-item'} item={item} menuRefs={this.menuRefs} />
                            })}
                        </ul>
                    </nav>
                    <div className="TopNavbarSocial">
                        <BsFacebook/>
                        <BsInstagram/>
                    </div>
                </div>
            </div>
        );
    }
}
export default TopNavbar;
