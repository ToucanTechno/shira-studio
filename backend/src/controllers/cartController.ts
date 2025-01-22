import {Request, Response } from "express";
import { Cart, ICart } from "../models/Cart";
import {  Product } from "../models/Product";
import mongoose, { isValidObjectId } from "mongoose";
import {StatusCodes} from "http-status-codes";
import { RequestValidator } from "../utils/validator";
import { isCartLocked, isCartUserAlreadyExist, isDocNotFound, isInvalidObjId, isMissingField } from "../utils/paramChecks";
import { User } from "../models/User";



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

// function checkUpdateCartInputs(res: Response, cartId: any, prodId: any,amount: any){
//     let correct = false;
//     if (!cartId) {
//         res.status(400).send('Missing cart id')
//     }
//     else if (!prodId){
//         res.status(400).send('No product id was given');
//     }
//     else if(!isValidObjectId(cartId) || !isValidObjectId(prodId)){
//         res.status(400).send('Invalid object id');//probably shouldn't send info but nice for debugging
//     }
//     else if (!amount){
//         res.status(400).send(`No amount was given`)
//     }else{
//         correct = true
//     }
//     return correct
// }

export const updateCart = async (req: Request, res:Response) => {
    const cartId = req.params['id']!;
    const prodId = req.body['productId']!;
    // TODO: improve name, amount doesn't indicate that it is an amount difference.
    let amountToChange = req.body['amount'];
    const err = await RequestValidator.validate(
        [{name: 'id', validationFuncs: [isMissingField.bind(null,cartId), isInvalidObjId.bind(null,cartId),
                                        isDocNotFound.bind(null,cartId,Cart), isCartLocked.bind(null, cartId)]},
         {name: 'productId', validationFuncs: [isMissingField.bind(null,prodId), isInvalidObjId.bind(null,prodId), 
                                               isDocNotFound.bind(null,prodId,Product)]},
         {name: 'amount', validationFuncs: [isMissingField.bind(null,amountToChange)]}
        ]
    )
    if(err){
        err.send(res)
        return
    }
    const cart = (await Cart.findById(cartId))!;
    const product = (await Product.findById(prodId))!;
    const prodToModify = (await cart.populate('products.$*.product')).products.get(prodId)
    if (prodToModify !== undefined) {
        amountToChange += prodToModify.amount;
    }
    else { //trying to change product that not in cart error

    }
    if(amountToChange <= 0){
        cart.products.delete(prodId);
        cart.save();
        res.status(200).send('Product removed from cart');
    }
    else if(amountToChange > product.stock){
        res.status(StatusCodes.CONFLICT).send('Requested amount above stock')
    }
    else{
        cart.products.set(prodId,{product:prodId,amount:amountToChange});
        cart.save();
        res.status(200).send('product amount updated successfully');
    }
    // try {
    //     if (!checkUpdateCartInputs(res,cartId,prodId,amountToChange)){
    //         return;
    //     }
    //     else {
    //         //A
    //         if (!cart) {
    //             res.status(400).send(`Unable to find matching cart with id: ${cartId}`);
    //         }
    //         else if(cart.lock){
    //             res.status(400).send('cart is locked please unlock to make changes in cart') //think if maybe it should unlock and lock
    //         }
    //         else if (!product){
    //             res.status(400).send(`Unable to find product with id: ${prodId}`)
    //         }
    //         else {
                
    //         }
    //     }
    // } catch (error: any) {
    //     res.status(400).send(error.message);
    // }
}

async function updateCartItemsStock(cart: mongoose.Document<unknown,{},ICart> & ICart, lock:Boolean): Promise<string>{
    const session = await Cart.startSession();
    session.startTransaction();
    cart.$session(session);
    cart.lock = lock;
    for (const cartItem of cart.products.values()){
        if (typeof cartItem.product === 'object') {
            cartItem.product.stock = cartItem.product.stock + (lock ? -cartItem.amount : cartItem.amount);
            if (cartItem.product.stock < 0){
                await session.abortTransaction(); //TODO: check that this actually abort transaction and ends session
                await session.endSession();
                return `not enough stock of item ${cartItem.product.name} id: ${cartItem.product.id}`;
            }
            await Product.findByIdAndUpdate(cartItem.product.id,{stock: cartItem.product.stock}).session(session)
        }
    };
    await cart.save();
    await session.commitTransaction();
    await session.endSession();
    return 'success';
}

export const cartLockAction = async(req: Request, res: Response) => {
    const cartId = req.params['id'];
    const lock = req.body['lock'];
    console.log("lock is " + lock)
    if (!cartId) {
        res.status(400).send('Missing cart id')
    }
    else if (!isValidObjectId(cartId)){
        res.status(400).send('Invalid object id');
    }
    else if (lock === undefined){
        res.status(400).send('no lock action sent');
    }
    else if(typeof lock !== 'boolean'){
        res.status(400).send('lock can only be of boolean type');
    }
    else {
        const cart = await Cart.findById(cartId).populate('products.$*.product')
        if (!cart) {//TODO change to better error handling here
            res.status(400).send(`Unable to find matching cart with id: ${cartId}`);
        }
        else if(cart.lock && lock){
            res.status(400).send('cart already locked');
        }
        else if(!cart.lock && !lock){
            res.status(400).send('cart already unlocked')
        }
        else {
            const result = await updateCartItemsStock(cart,lock)
            if (result === 'success') {
                const action = (lock) ? 'lock' : 'unlock';
                res.status(200).send(`cart ${action} successful`);
            }
            else {
                res.status(400).send(result);
            }
        }
    }
}
