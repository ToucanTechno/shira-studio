import mongoose, { Types } from 'mongoose';
import { IProductDB } from './Product';

export interface CartProduct {
    product:IProductDB | string;
    amount:number;
};

export interface ICart {
    userId?: Types.ObjectId;
    products: Map<string , CartProduct>
    createdAt?: Date 
    updatedAt?: Date //TODO: add accessedAt so we can delete cart more gracefully 
    lock: Boolean
}

const cartSchema = new mongoose.Schema<ICart>({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    products: {
        type: Map,
        of: new mongoose.Schema({
            product:{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product'},
            amount: Number
        })
    },
    lock: {
        type: Boolean,
        default: false
    }
}, { timestamps: true , minimize: false});


export const Cart = mongoose.model<ICart>("Cart", cartSchema);

// example Cart.findOne({_id:'65c654407f62520fd4965603'}).populate(['userId','products.$*.product']).exec().then((cartOne)=>{ console.log(cartOne?.products.get('65c64d5db36e9cdeb9d9e710'))});
