import { Cart } from "../models/Cart";
import { IOrder, Order, shipmentStep } from "../models/Order";
import { Request, Response } from "express";


export const getOrder = async (req:Request, res:Response) => {
    const orderId = req.params['id'];
    if(!orderId){
        res.status(400).send('Missing order id');
        return;
    }
    let order = (await Order.findById(orderId).populate('products.$*.product'))
    if(!order){
        res.status(400).send('could not find order with the given id');
        return;
    }
    order.products.forEach((prod) => {
        delete (prod.product as any)._doc.__v
        delete (prod as any)._doc._id
    });
    delete (order as any)._doc.__v
    res.status(200).send(order)
}


export const getOrders = async (req: Request, res: Response) => {
    //TODO: when better error handling make sure skip and limit are of type number
    const skip = req.body['skip'] !== undefined ? req.body['skip'] : 0;
    const limit = req.body['limit'] !== undefined ? Math.min(req.body['limit'],50) : 10;
    const [orders,count] = await Promise.all([Order.find().sort({createdAt : 'asc'}).skip(skip).limit(limit),Order.countDocuments()])
    res.status(200).send({orders:orders , total:count});
};

//TODO: can try to add check to israel post for valid address
export const insertOrder = async (req: Request, res: Response) => {
    const order: IOrder = req.body;
    const cartId = req.body['cart'];
    if (!order.name || !order.city || !order.street || !cartId || !order.paymentReceipt || !order.paymentType) {
        res.status(400).send('missing field');
        return;
    }
    const cart = await Cart.findById(cartId);
    if (!cart || !cart.products) {
        res.status(400).send('no cart with given id');
        return;
    }
    if ((await Order.find({ cart: cartId })).length) {
        res.status(400).send('order with this cart id already exist');
        return;
    }
    if (!cart.lock) {
        res.status(400).send('cart must be locked before ordering');//to make sure we have stock for the items
        return;
    }
    order.products = cart.products;
    order.shipmentStep = shipmentStep.Packaging;   
    //should reset user cart somehow after order complete so can order new items
    const objOrder = new Order(order);
    const result = await objOrder.save();
    res.status(200).send(result.id)
}

export const updateOrder = async(req:Request, res:Response) => {
    const orderId = req.params['id'];
    if(!orderId){
        res.status(400).send('Missing order id');
        return;
    }
    let order = await Order.findById(orderId)
    if(!order){
        res.status(400).send('could not find order with the given id');
        return;
    }
    //TODO: change it to only update few fields need to think more which fields should be changeable
    //and need to check for valid body of the request
    const result = await Order.updateOne({'_id': orderId}, req.body);
    if(!result || !result.modifiedCount){
        res.status(400).send('didn\'t modify the order');
    }
    else {
        res.status(200).send('order modified correctly')
    }
}