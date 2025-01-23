import { isValidObjectId } from "mongoose"
import {
    ResponseError,
    ErrorDocNotFound,
    ErrorInvalidObjectId,
    ErrorMissingField,
    ErrorInvalidType,
    ErrorCartUserAlreadyExist,
    ErrorCartLocked,
    ErrorCartUnlocked
} from "./error"
import { Cart } from "../models/Cart"


export const isMissingField = (field:any,name:string): ResponseError | undefined => {
    if(field !== undefined){
        return undefined
    }
    return new ErrorMissingField(name)
}

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
export const isDocNotFound = async (objectId:string,model:any,_name:string) : Promise<ResponseError | undefined> =>{
    if(await model.findById(objectId)){
        return undefined
    }
    return new ErrorDocNotFound(model.modelName,objectId);
}

export const isCartUserAlreadyExist = async (userId:string,_name:string) => {
    const cart = await Cart.findOne({userId:userId}).exec() //check if need exec
    if( cart !== null){
        return new ErrorCartUserAlreadyExist(userId,cart.id)
    }
    return undefined
}

export const isCartLocked = async (cartId:string,expected:boolean, _name:string) => {
    const cart = await Cart.findById(cartId)
    if(expected){
        if(!cart?.lock){
            return new ErrorCartUnlocked(cartId)
        }
    }
    else{
        if(cart?.lock){
            return new ErrorCartLocked(cartId)
        }
    }
    return undefined
}