import React from "react";
import {Route, Routes, useLocation} from "react-router-dom";
import PanelLogin from "./PanelLogin";
import AdminStatistics from "./AdminStatistics";
import RequireAuth from "../../utils/RequireAuth";
import {AuthProvider} from "../../services/AuthContext";
import AdminCategories from "./AdminCategories";
import AdminProducts from "./AdminProducts";
import AdminOrders from "./AdminOrders";
import AdminUsers from "./AdminUsers";
import './PanelApp.css';
import AdminProductsEdit from "./AdminProductsEdit";
import AdminProductsDelete from "./AdminProductsDelete";
import TopAdminNavbar from "./TopAdminNavbar";

const PanelApp = () => {
    const { pathname } = useLocation();
    return (
        <AuthProvider>
            {!pathname.startsWith("/control-panel/login") &&
            <TopAdminNavbar/>
            }
            <Routes>
                <Route element={<RequireAuth/>}>
                    <Route path="/" element={<AdminStatistics/>}/>
                    <Route path="/categories" element={<AdminCategories/>}/>
                    <Route path="/products" element={<AdminProducts/>}/>
                    <Route path="/products/add" element={<AdminProductsEdit/>}/>
                    <Route path="/products/:id/edit" element={<AdminProductsEdit/>}/>
                    <Route path="/products/:id/delete" element={<AdminProductsDelete/>}/>
                    <Route path="/orders" element={<AdminOrders/>}/>
                    <Route path="/users" element={<AdminUsers/>}/>
                </Route>
                <Route path="/login" element={<PanelLogin/>}/>
            </Routes>
        </AuthProvider>
)
};

export default PanelApp;
