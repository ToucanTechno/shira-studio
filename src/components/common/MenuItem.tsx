import React from "react";
import Link from "next/link";

type ItemType = {
    name: string;
    link: string;
    text: string;
    submenu?: ItemType[]
};

interface MenuItemProps {
    item: ItemType;
    menuRefs: {[key: string] : React.RefObject<HTMLUListElement>};
}

const MenuItem = (props: MenuItemProps) => {
    const item: ItemType = props.item;
    const menuRefs:{[key: string] : React.RefObject<HTMLUListElement>} = props.menuRefs;

    const navEnter = (itemRef: React.RefObject<HTMLElement>) => {
        if (itemRef && itemRef.current) {
            itemRef.current.style.display = 'block';
            itemRef.current.classList.remove('slow-fade-animation');
            itemRef.current.classList.add('slow-appear-animation');
        }
    };
    const navExit = (itemRef: React.RefObject<HTMLElement>) => {
        if (itemRef && itemRef.current) {
            itemRef.current.classList.remove('slow-appear-animation');
            itemRef.current.classList.add('slow-fade-animation');
        }
    }

    return (
    /* TODO: implement enter exit queue so that we don't get flickering */
        <li key={item.name + '-nav'}
            {...(item.submenu) ? {
                onMouseEnter: () => {
                    navEnter(menuRefs[item.name])
                },
                onMouseLeave: () => {
                    navExit(menuRefs[item.name])
                }
            } : {}
            }>

            <Link href={item.link}>{item.text}</Link>
            {(item.submenu) ?
                <ul ref={menuRefs[item.name]}
                    className="TopNavbarSub">
                    {item.submenu.map(subItem => {
                        return (
                            <li key={subItem.name + '-sub-nav'}>
                                <Link href={subItem.link}>{subItem.text}</Link>
                            </li>
                        )
                    })}
                </ul> : null
            }
        </li>
    );
}

export type { ItemType };
export default MenuItem;
