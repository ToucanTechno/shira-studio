import React, {Component} from "react";
import {Link} from "react-router-dom";

type ItemType = {
    name: string;
    link: string;
    text: string;
    submenu?: ItemType[]
};

interface MenuItemProps {
    item: ItemType;
    menuRefs: {[key: string] : React.RefObject<HTMLUListElement>};
};

class MenuItem extends Component<MenuItemProps> {
    private item: ItemType;
    private menuRefs:{[key: string] : React.RefObject<HTMLUListElement>} = {};

    constructor(props: MenuItemProps) {
        super(props);
        this.item = props.item;
        this.menuRefs = props.menuRefs;
    }

    /* TODO: implement enter exit queue so that we don't get flickering */
    navEnter(itemRef: React.RefObject<HTMLElement>) {
        if (itemRef && itemRef.current) {
            itemRef.current.style.display = 'block';
            itemRef.current.classList.remove('slow-fade-animation');
            itemRef.current.classList.add('slow-appear-animation');
        }
    }

    navExit(itemRef: React.RefObject<HTMLElement>) {
        if (itemRef && itemRef.current) {
            itemRef.current.classList.remove('slow-appear-animation');
            itemRef.current.classList.add('slow-fade-animation');
        }
    }

    render() {
        return (
            <li key={this.item.name + '-nav'}
                {...(this.item.submenu) ? {
                onMouseEnter: () => {
                    this.navEnter(this.menuRefs[this.item.name])
                },
                onMouseLeave: () => {
                    this.navExit(this.menuRefs[this.item.name])
                }
            } : {}
                }>

                <Link to={this.item.link}>{this.item.text}</Link>
                {(this.item.submenu) ?
                    <ul ref={this.menuRefs[this.item.name]}
                        className="TopNavbarSub">
                        {this.item.submenu.map(subItem => {
                            return (
                                <li key={subItem.name + '-sub-nav'}>
                                    <Link to={subItem.link}>{subItem.text}</Link>
                                </li>
                            )
                        })}
                    </ul> : null
                }
            </li>
        )    }
}

export type { ItemType };
export default MenuItem;
