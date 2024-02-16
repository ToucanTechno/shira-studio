import {Request, Response } from "express";
import { Cart } from "../models/Cart";
import { Product } from "../models/Product";
import { isValidObjectId } from "mongoose";


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