import mongoose from 'mongoose';
import { ICart, ProductOrder } from './Cart';

export enum shipmentStep { //probably would need it in the front as well to know what the value means
    Packaging,
    Shipped,
    Arrived
}

export interface IOrder {
    name: string;
    country: string
    city: string
    street: string
    zipCode: number
    comments: string
    paymentType: string //maybe can change to enum of known payments
    paymentReceipt: string
    shipmentStep: shipmentStep //maybe add array of date when step changed for better tracking
    trackingNumber: string
    products: Map<string,ProductOrder>
    cart: string | ICart
    createdAt:Date
    updatedAt:Date
}

const orderSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    country: {
        type: String
    },
    city: {
        type: String
    },
    street: {
        type:String,
    },
    zipCode: {
        type:Number
    },
    comments: {
        type: String
    },
    paymentType: {
        type:String,
        required: true
    },
    paymentReceipt: {
        type:String,
        required: true
    },
    shipmentStep: {//packaged shipped and such
        type:String
    },
    trackingNumber:{
        type:String //not sure how tracking number actually looks like maybe have letters and such
    },
    products: { //if we gonna move the cart to archive it would be easier to track products this way can change
        type: Map,
        of: new mongoose.Schema({
            product:{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product'},
            amount: Number
        })
    },
    cart: { //this is so we can make sure no 2 orders are from the same cart for example multiple click on order
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cart',
        required: true
    },
    
}, {timestamps: true});

export const Order = mongoose.model<IOrder>("orders", orderSchema);