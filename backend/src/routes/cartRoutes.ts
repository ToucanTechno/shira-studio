import express from "express";
import { getCartSummary, insertCart, cartLockAction, updateCart, getCart } from "../controllers/cartController";
import { checkCartLockExpiration } from "../middleware/cartLockExpiration";

export const cartRoutes = express.Router();

// Apply lock expiration check to all routes with :id parameter
cartRoutes.use('/:id', checkCartLockExpiration);

cartRoutes.get('/:id', getCart);

cartRoutes.get('/:id/summary',getCartSummary)

cartRoutes.post('/', insertCart);

cartRoutes.put('/:id', updateCart);

// TODO: add delete item from cart

cartRoutes.put('/:id/lock', cartLockAction)
