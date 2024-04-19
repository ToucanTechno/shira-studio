import express from "express";
import { getCartSummery, insertCart, cartAction, updateCart, getCart } from "../controllers/cartController";

export const cartRoutes = express.Router();

cartRoutes.get('/:id', getCart);

cartRoutes.get(':id/summery',getCartSummery)

cartRoutes.post('/', insertCart);

cartRoutes.put('/:id', updateCart);

cartRoutes.put('/:id/lock', cartAction)
