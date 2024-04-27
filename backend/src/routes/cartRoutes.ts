import express from "express";
import { getCartSummary, insertCart, cartLockAction, updateCart, getCart } from "../controllers/cartController";

export const cartRoutes = express.Router();

cartRoutes.get('/:id', getCart);

cartRoutes.get('/:id/summary',getCartSummary)

cartRoutes.post('/', insertCart);

cartRoutes.put('/:id', updateCart);

// TODO: add delete item from cart

cartRoutes.put('/:id/lock', cartLockAction)
