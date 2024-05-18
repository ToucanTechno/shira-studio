import React, {useContext} from 'react';
import './App.css';
import Home from "./pages/Home";
import {Route, Routes} from "react-router-dom";
import TopNavbar from "./components/common/TopNavbar";
import About from "./pages/About";
import Category from "./pages/Category";
import ProductCategory from "./pages/ProductCategory";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import {AuthContext, AuthProvider} from "./services/AuthContext";
import {Box} from "@chakra-ui/react";
import {CartProvider} from "./services/CartContext";

const App = () => {
    const { api, guestData, setGuestData } = useContext(AuthContext)
    return (
        <AuthProvider>
            <CartProvider api={api} guestData={guestData} setGuestData={setGuestData}>
                <Box className="App">
                    <TopNavbar/>
                    <Routes>
                        <Route path="/" element={<Home/>}/>
                        <Route path="/about" element={<About/>}/>
                        <Route path="/categories/:category" element={<Category/>}/>
                        <Route path="/categories/:category/:productCategory" element={<ProductCategory/>}/>
                        <Route path="/product/:product" element={<Product/>}/>
                        <Route path="/cart" element={<Cart/>}/>
                    </Routes>
                </Box>
            </CartProvider>
        </AuthProvider>
    );
};

export default App;
