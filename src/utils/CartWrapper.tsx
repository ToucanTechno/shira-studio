import {CartProvider} from "../services/CartContext";
import {ReactNode, useContext} from "react";
import {AuthContext} from "../services/AuthContext";

const CartWrapper = (props: { children?: ReactNode }) => {
    const { api, guestData, setGuestData } = useContext(AuthContext)
    return (
        <CartProvider api={api} guestData={guestData} setGuestData={setGuestData}>
            {props.children}
        </CartProvider>
    )
}

export default CartWrapper;