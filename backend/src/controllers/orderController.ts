import { Cart } from "../models/Cart";
import { IOrder, Order, ShipmentStep } from "../models/Order";
import { Request, Response } from "express";
import {RequestValidator} from "../utils/validator";
import {
    isCartHaveOrder, isCartHaveProducts,
    isCartLocked,
    isDocNotFoundById,
    isInvalidObjId,
    isInvalidType,
    isMissingField,
} from "../utils/paramChecks";
import {ErrorDocNotUpdated} from "../utils/error";
import { logger } from "../utils/logger";


export const getOrder = async (req:Request, res:Response) => {
    const orderId = req.params['id']!
    const err = await RequestValidator.validate(
        [{name:'id',validationFuncs:[isMissingField.bind(null,orderId),isInvalidObjId.bind(null,orderId),
                                     isDocNotFoundById.bind(null,orderId,Order)]}]
    )
    if(err){
        err.send(res)
        return
    }
    let order = (await Order.findById(orderId).populate('products.$*.product'))!
    order.products.forEach((prod) => {
        delete (prod.product as any)._doc.__v
        delete (prod as any)._doc._id
    })
    delete (order as any)._doc.__v
    res.status(200).send(order)
}

//the return changed to be more readable so look it doesn't break anything in front
export const getOrders = async (req: Request, res: Response) => {
    const skip = req.body['skip'] !== undefined && typeof req.body['skip'] === 'number' ? req.body['skip'] : 0;
    const limit = req.body['limit'] !== undefined ? Math.min(req.body['limit'],50) : 10;
    const orders = await Order.find().sort({createdAt : 'asc'}).skip(skip).limit(limit)
    res.status(200).send({orders:orders , total:orders.length});
};

//TODO: can try to add check to israel post for valid address
export const insertOrder = async (req: Request, res: Response) => {
    const order: IOrder = req.body
    const cartId = req.body['cart']
    logger.log('[ORDER DEBUG] insertOrder called with cartId:', cartId);
    logger.log('[ORDER DEBUG] Request body:', JSON.stringify(req.body, null, 2));
    //TODO:add payment receipt and type depends how the payment would be implemented
    const err = await RequestValidator.validate(
        [{name:'cart',validationFuncs:[isMissingField.bind(null,cartId),isInvalidObjId.bind(null,cartId),
                                       isDocNotFoundById.bind(null,cartId,Cart),isCartHaveOrder.bind(null,cartId),
                                       isCartHaveProducts.bind(null,cartId),isCartLocked.bind(null,cartId,true)]},
         {name:'name',validationFuncs:[isMissingField.bind(null,order.name),isInvalidType.bind(null,order.name,'string')]},
         {name:'city',validationFuncs:[isMissingField.bind(null,order.city),isInvalidType.bind(null,order.city,'string')]},
         {name:'street',validationFuncs:[isMissingField.bind(null,order.street),isInvalidType.bind(null,order.street,'string')]}
        ]
    )
    if(err){
        err.send(res)
        return
    }
    const cart = (await Cart.findById(cartId))!
    order.products = cart.products;
    order.shipmentStep = ShipmentStep.Packaging;
    //TODO: should reset user cart somehow after order complete so can order new items
    const objOrder = new Order(order);
    const result = await objOrder.save();
    res.status(200).send(result.id)
}

export const updateOrder = async(req:Request, res:Response) => {
    const orderId = req.params['id']!
    const err = await RequestValidator.validate(
        [{name:'id',validationFuncs:[isMissingField.bind(null,orderId),isInvalidObjId.bind(null,orderId),
                isDocNotFoundById.bind(null,orderId,Order)]}]
    )
    if(err){
        err.send(res)
        return
    }
    //TODO: change it to only update few fields need to think more which fields should be changeable
    //      and need to check for valid body of the request
    const result = await Order.updateOne({'_id': orderId}, req.body)
    if(!result || !result.modifiedCount){
        const err = new ErrorDocNotUpdated(orderId,req.body)
        err.send(res)
        return
    }
    else {
        res.status(200).send('order modified correctly')
    }
}