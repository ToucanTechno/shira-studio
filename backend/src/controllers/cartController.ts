import {Request, Response } from "express";
import { Cart, ICart } from "../models/Cart";
import {  Product } from "../models/Product";
import mongoose from "mongoose";
import { RequestValidator } from "../utils/validator";
import {
    isCartLocked,
    isCartUserAlreadyExist,
    isDocNotFound,
    isInvalidObjId,
    isInvalidType,
    isMissingField
} from "../utils/paramChecks";
import { User } from "../models/User";
import {ErrorAmountAboveStock, ResponseError} from "../utils/error";



export const getCart = async (req:Request,res:Response) => {
    const cartId = req.params['id']!;
    const err = await RequestValidator.validate(
        [{name:'id',validationFuncs:[isMissingField.bind(null,cartId),isInvalidObjId.bind(null,cartId),isDocNotFound.bind(null,cartId,Cart)]}]
    )
    if(err){
        err.send(res)
        return
    }
    let cart = (await Cart.findById(cartId).populate('products.$*.product'))
    cart?.products.forEach((prod) => {
        delete (prod.product as any)._doc.__v
        delete (prod as any)._doc._id
    });
    delete (cart as any)._doc.__v
    res.status(200).send(cart)
}

export const getCartSummary = async (req: Request, res: Response) => {
    const cartId = req.params['id']!;
    const err = await RequestValidator.validate(
        [{name:'id',validationFuncs:[isMissingField.bind(null,cartId),isInvalidObjId.bind(null,cartId),isDocNotFound.bind(null,cartId,Cart)]}]
    )
    if(err){
        err.send(res)
        return
    }
    const cart = (await Cart.findById(cartId))!;
    res.status(200).send({totalProducts: cart.products.size});
};

export const insertCart = async (req: Request, res: Response) => {
    //TODO: make sure to rate limit so no dddos
    //TODO: have interval to remove unactive carts
    const cartObj = new Cart({products: new Map(), lock: false});
    const userId = req.body["userId"]
    if (userId){
        const err = await RequestValidator.validate(
            [{name:'userId',validationFuncs:[isInvalidObjId.bind(null,userId),isDocNotFound.bind(null,userId,User),
                                             isCartUserAlreadyExist.bind(null,userId)]
            }]
        )
        if(err){
            err.send(res)
            return
        }
        cartObj.userId = userId
    }
    const result = await cartObj.save();
    res.status(201).send({message: "carte created successfully.", id:result._id, lock: false});
};

export const updateCart = async (req: Request, res:Response) => {
    const cartId = req.params['id']!
    const prodId = req.body['productId']!
    let amountToChange = req.body['amount']
    const err = await RequestValidator.validate(
        [{name: 'id', validationFuncs: [isMissingField.bind(null,cartId), isInvalidObjId.bind(null,cartId),
                                        isDocNotFound.bind(null,cartId,Cart), isCartLocked.bind(null, cartId,false)]},
         {name: 'productId', validationFuncs: [isMissingField.bind(null,prodId), isInvalidObjId.bind(null,prodId), 
                                               isDocNotFound.bind(null,prodId,Product)]},
         {name: 'amount', validationFuncs: [isMissingField.bind(null,amountToChange),isInvalidType.bind(null,amountToChange,'number')]}
        ]
    )
    if(err){
        err.send(res)
        return
    }

    const cart = (await Cart.findById(cartId))!
    const product = (await Product.findById(prodId))!;
    const prodToModify = (await cart.populate('products.$*.product')).products.get(prodId)
    let newAmount = amountToChange
    if (prodToModify !== undefined) {//if no product found meas we need to add product to cart by itself
        newAmount += prodToModify.amount
    }
    if(newAmount <= 0){
        cart.products.delete(prodId)
        cart.save()
        res.status(200).send('Product removed from cart')
    }
    else if(newAmount > product.stock){
        new ErrorAmountAboveStock(prodId,product.stock,newAmount).send(res)
        return
    }
    else{
        cart.products.set(prodId,{product:prodId,amount:newAmount})
        cart.save()
        res.status(200).send('product amount updated successfully')
    }
}
//update the cart lock and product amount depends on if wanting to lock or unlock cart
async function updateCartItemsStock(cart: mongoose.Document<unknown,{},ICart> & ICart, lock:Boolean): Promise<ResponseError | undefined>{
    const session = await Cart.startSession()
    session.startTransaction()
    cart.$session(session)
    cart.lock = lock
    for (const cartItem of cart.products.values()){//when cart is locked remove the stock from products temporarily
        if (typeof cartItem.product === 'object') {
            if (lock && cartItem.product.stock - cartItem.amount < 0){//this make sure we have enough in stock if locking
                await session.abortTransaction() //TODO: check that this actually abort transaction and ends session
                await session.endSession()
                return new ErrorAmountAboveStock(cartItem.product._id!,cartItem.product.stock,cartItem.amount)
            }
            cartItem.product.stock = cartItem.product.stock + (lock ? -cartItem.amount : cartItem.amount)
            await Product.findByIdAndUpdate(cartItem.product.id,{stock: cartItem.product.stock}).session(session)
        }
    }
    await cart.save()
    //TODO: make sure to send message if commit failed
    await session.commitTransaction()
    await session.endSession()
    return undefined
}

export const cartLockAction = async(req: Request, res: Response) => {
    const cartId = req.params['id']!
    const lock = req.body['lock'];
    const err = await RequestValidator.validate(
        [
            {name:'id',validationFuncs:[isMissingField.bind(null,cartId),isInvalidObjId.bind(null,cartId),
                                        isDocNotFound.bind(null,cartId,Cart)]},
            {name:'lock', validationFuncs: [isMissingField.bind(null,lock),isInvalidType.bind(null,lock,'boolean')]}
        ]
    )
    if(err){
        err.send(res)
        return
    }
    else {
        const cart = (await Cart.findById(cartId).populate('products.$*.product'))!
        const expectedLock = await isCartLocked(cartId,!lock,"")
        if(expectedLock !== undefined){
            expectedLock.send(res)
            return
        }
        else {
            const result = await updateCartItemsStock(cart,lock)
            if (result === undefined) {
                const action = (lock) ? 'lock' : 'unlock'
                res.status(200).send(`cart ${action} successful`)
            }
            else {
                result.send(res)
            }
        }
    }
}
