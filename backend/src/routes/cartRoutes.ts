import express from "express";
import { getCartSummery, insertCart, cartAction, updateCart } from "../controllers/cartController";

export const cartRoutes = express.Router();

cartRoutes.get('/:id', getCartSummery);

cartRoutes.post('/', insertCart);

cartRoutes.put('/:id', updateCart);

cartRoutes.put('/:id/lock', cartAction)
