import React from 'react';
import './App.css';
import Home from "./pages/Home";
import {Route, Routes} from "react-router-dom";
import TopNavbar from "./components/common/TopNavbar";
import About from "./pages/About";
import Category from "./pages/Category";
import ProductCategory from "./pages/ProductCategory";
import Product from "./pages/Product";
import { ChakraProvider } from '@chakra-ui/react'
import Cart from "./pages/Cart";

const App = () => {
  return (
      <div className="App">
          <TopNavbar/>
          <Routes>
              <Route path="/" element={<Home/>}/>
              <Route path="/about" element={<About/>}/>
              <Route path="/category/:category" element={<Category/>}/>
              <Route path="/category/:category/:productCategory" element={<ProductCategory/>}/>
              <Route path="/product/:product" element={<Product/>}/>
              <Route path="/cart" element={<Cart/>}/>
          </Routes>
      </div>
  );
};

export default App;
