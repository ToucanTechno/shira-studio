import React from 'react';
import './App.css';
import Home from "./pages/Home";
import {Route, Routes} from "react-router";
import TopNavbar from "./components/common/TopNavbar";
import About from "./pages/About";
import Category from "./pages/Category";
import ProductCategory from "./pages/ProductCategory";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import { AuthProvider } from "./services/AuthContext";
import { Box } from "@chakra-ui/react";
import CartWrapper from "./utils/CartWrapper";

const App = () => {
    return (
        <AuthProvider>
            <CartWrapper>
                <Box className="App">
                    <TopNavbar/>
                    <Routes>
                        <Route path="/" element={<Home/>}/>
                        <Route path="/about" element={<About/>}/>
                        <Route path="/categories/:category" element={<Category/>}/>
                        <Route path="/categories/:category/:productCategory" element={<ProductCategory/>}/>
                        <Route path="/product/:product" element={<Product/>}/>
                        <Route path="/cart" element={<Cart/>}/>
                        <Route path="/login" element={<Login/>}/>
                    </Routes>
                </Box>
            </CartWrapper>
        </AuthProvider>
    )
}

export default App;
