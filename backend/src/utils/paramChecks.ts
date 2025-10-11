import { isValidObjectId } from "mongoose"
import {
    ResponseError,
    ErrorDocNotFound,
    ErrorInvalidObjectId,
    ErrorMissingField,
    ErrorInvalidType,
    ErrorValueAlreadyInUse,
    ErrorCartLocked,
    ErrorCartUnlocked, ErrorAlreadyInDb, ErrorCartAlreadyHaveOrdered, ErrorCartMissingProducts
} from "./error"
import { Cart } from "../models/Cart"
import { Order} from "../models/Order";


export const isMissingField = (field:any,name:string): ResponseError | undefined => {
    if(field !== undefined){
        return undefined
    }
    return new ErrorMissingField(name)
}
//TODO:needs better way to check for valid objectID
//     if giving pure number like 6 its return true even though it throws cast error when trying to find doc with id 6
export const isInvalidObjId = (objectId:string,name:string): ResponseError | undefined => {
    if(isValidObjectId(objectId)){
        return undefined
    }
    return new ErrorInvalidObjectId(objectId,name)
}

//this is only the basic js types since cant check typescript types during runtime
export const isInvalidType = (field:any, expectedType:string,name:string): ResponseError | undefined => {
    if(typeof field === expectedType){
        return undefined
    }
    return new ErrorInvalidType(name,typeof field,expectedType)
}
// not sure how to check for correct type in generic way
//export const isInvalidType = (param:a)

//how to change model to be of type mongoose.Model<T> type had problems with passing Product
export const isDocNotFoundById = async (objectId:string, model:any, _name:string) : Promise<ResponseError | undefined> =>{
    if(await model.findById(objectId)){
        return undefined
    }
    return new ErrorDocNotFound(model.modelName,objectId);
}

export const isDocNotFoundByParam = async (paramName:string,
                                           paramValue:any, model:any, _name:string):Promise<ResponseError | undefined> =>{
    if(await model.findOne({[paramName]:paramValue})){
        return undefined
    }
    return new ErrorDocNotFound(model.modelName,paramValue);
}

export const isDocAlreadyInDb = async (paramName:string,
                                       paramValue:string, model:any, _name:string):Promise<ResponseError | undefined> =>{
    if(await model.findOne({[paramName]:paramValue})){
        return new ErrorAlreadyInDb(model.modelName,paramValue);
    }
    return undefined
}

export const isValueAlreadyInUse = async (field:string,value:any,model:any, _name:string) => {
    const data = await model.findOne({[field]:value}).exec() //check if need exec
    if( data !== null){
        return new ErrorValueAlreadyInUse(field, value, model)
    }
    return undefined
}

export const isCartLocked = async (cartId:string,expected:boolean, _name:string) => {
    const cart = await Cart.findById(cartId)
    console.log(`[CART LOCK DEBUG] Checking cart ${cartId}: current lock=${cart?.lock}, expected=${expected}`);
    if(expected){
        if(!cart?.lock){
            console.log(`[CART LOCK DEBUG] ERROR: Cart is unlocked but expected to be locked`);
            return new ErrorCartUnlocked(cartId)
        }
    }
    else{
        if(cart?.lock){
            console.log(`[CART LOCK DEBUG] ERROR: Cart is locked but expected to be unlocked`);
            return new ErrorCartLocked(cartId)
        }
    }
    console.log(`[CART LOCK DEBUG] Validation passed`);
    return undefined
}

export const isCartHaveOrder = async (cartId:string) => {
    const order = (await Order.find({ cart: cartId }))
    if (order.length) {
        return new ErrorCartAlreadyHaveOrdered(cartId,order[0]?.id)
    }
    return undefined
}

export const isCartHaveProducts = async (cartId:string) => {
    const cart = await Cart.findById(cartId)
    if(cart?.products.size === 0){
        return new ErrorCartMissingProducts(cartId)
    }
    return undefined
}