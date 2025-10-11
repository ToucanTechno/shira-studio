import { Request, Response, NextFunction } from 'express';
import { Cart } from '../models/Cart';
import mongoose from 'mongoose';

/**
 * Middleware to check if a cart's lock has expired and auto-unlock if necessary
 * This should be applied to all cart routes that use cartId parameter
 */
export const checkCartLockExpiration = async (
    req: Request,
    _res: Response,
    next: NextFunction
) => {
    try {
        const cartId = req.params['id'];
        
        // Skip if no cartId in params
        if (!cartId) {
            return next();
        }

        // Validate cartId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(cartId)) {
            return next();
        }

        const cart = await Cart.findById(cartId).populate('products.$*.product');
        
        // Skip if cart not found or not locked
        if (!cart || !cart.lock) {
            return next();
        }

        // Check if lock has expired
        const now = new Date();
        if (cart.lockExpiresAt && now > cart.lockExpiresAt) {
            console.log(`[CART LOCK EXPIRATION] Cart ${cartId} lock expired at ${cart.lockExpiresAt.toISOString()}, auto-unlocking`);
            
            // Release stock for all products in cart
            const session = await Cart.startSession();
            session.startTransaction();
            
            try {
                cart.$session(session);
                
                // Release stock back to products
                for (const cartItem of cart.products.values()) {
                    if (typeof cartItem.product === 'object') {
                        const newStock = cartItem.product.stock + cartItem.amount;
                        await mongoose.model('Product').findByIdAndUpdate(
                            cartItem.product._id,
                            { stock: newStock },
                            { session }
                        );
                    }
                }
                
                // Unlock cart and clear timestamps
                cart.lock = false;
                cart.lockedAt = undefined;
                cart.lockExpiresAt = undefined;
                await cart.save();
                
                await session.commitTransaction();
                console.log(`[CART LOCK EXPIRATION] Cart ${cartId} successfully unlocked and stock released`);
            } catch (error) {
                await session.abortTransaction();
                console.error(`[CART LOCK EXPIRATION] Failed to unlock cart ${cartId}:`, error);
            } finally {
                await session.endSession();
            }
        }
        
        next();
    } catch (error) {
        console.error('[CART LOCK EXPIRATION] Middleware error:', error);
        // Don't block the request if middleware fails
        next();
    }
};