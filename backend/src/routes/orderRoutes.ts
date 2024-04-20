import express from "express";
import { getOrder, getOrders, insertOrder, updateOrder } from "../controllers/orderController";

export const orderRoutes = express.Router();

orderRoutes.get('/',getOrders);//TODO: make sure only admin can do this

orderRoutes.get('/:id',getOrder);

orderRoutes.post('/',insertOrder);

orderRoutes.put('/:id',updateOrder);//TODO: make sure only admin can do this request/allow for only specific fields to change