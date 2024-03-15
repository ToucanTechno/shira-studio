import {Request, Response } from "express";
import { Cart, ICart } from "../models/Cart";
import { Product } from "../models/Product";
import mongoose, { isValidObjectId } from "mongoose";


export const getCartSummery = async (req: Request, res: Response) => {
    const cartId = req.params['id'];
    try {
        if (!cartId) {
            throw new Error("Missing cart ID");
        }
        const cart = await Cart.findById(cartId);
        if (!cart) {
            res.status(404).send(`Unable to find matching cart with id: ${req.params['id']}`);
        }
        else{
            res.status(200).send({totalProducts: cart.products.size});
        }
    } catch (error: any) {
        res.status(400).send(error.message);
    }
};

export const insertCart = async (req: Request, res: Response) => {
    //TODO: make sure to rate limit so no dddos
    const cartObj = new Cart({products: new Map()});
    if (req.body["userId"]){
        if(await Cart.findOne({userId:req.body["userId"]}).exec() !== null){
            res.status(400).send({message: "cart already exist for user"});
            return;
        }
        cartObj.userId = req.body["userId"];
    }
    const result = await cartObj.save();
    res.status(201).send({message: "carte created successfully.", id:result._id});
};

function checkUpdateCartInputs(res: Response, cartId: any, prodId: any,amount: any){
    let correct = false;
    if (!cartId) {
        res.status(400).send('Missing cart id')
    }
    else if (!prodId){
        res.status(400).send('No product id was given');
    }
    else if(!isValidObjectId(cartId) || !isValidObjectId(prodId)){
        res.status(400).send('Invalid object id');//probably shouldn't send info but nice for debugging
    }
    else if (!amount){
        res.status(400).send(`No amount was given`)
    }else{
        correct = true
    }
    return correct
}

export const updateCart = async (req: Request, res:Response) => {
    const cartId = req.params['id'];
    const prodId = req.body['productId'];
    let amountToChange = req.body['amount'];
    
    try {
        if (!checkUpdateCartInputs(res,cartId,prodId,amountToChange)){
            return;
        }
        else {
            const cart = await Cart.findById(cartId);
            const product = await Product.findById(prodId);
            if (!cart) {
                res.status(400).send(`Unable to find matching cart with id: ${cartId}`);
            }
            else if(cart.lock){
                res.status(400).send('cart is locked please unlock to make changes in cart') //think if maybe it should unlock and lock
            }
            else if (!product){
                res.status(400).send(`Unable to find product with id: ${prodId}`)
            }
            else {
                const prodToModify = (await cart.populate('products.$*.product')).products.get(prodId)
                if (prodToModify !== undefined) {
                    amountToChange += prodToModify.amount;
                }
                if(amountToChange <= 0){
                    cart.products.delete(prodId);
                    cart.save();
                    res.status(200).send('Product removed from cart');
                }
                else if(amountToChange > product.stock){
                    res.status(400).send('Requested amount above stock')
                }
                else{
                    cart.products.set(prodId,{product:prodId,amount:amountToChange});
                    cart.save();
                    res.status(200).send('product amount updated seccefully');
                }
            }
        }
    } catch (error: any) {
        res.status(400).send(error.message);
    }
}

async function controlCart(cart: mongoose.Document<unknown,{},ICart> & ICart, lock:Boolean): Promise<string>{
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

export const cartAction = async(req: Request, res: Response) => {
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
        else{
            const result = await controlCart(cart,lock)
            if (result === 'success')
                res.status(200).send('cart action successful');
            else
                res.status(400).send(result);
        }
    }
}