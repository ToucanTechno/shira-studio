import mongoose, { ObjectId } from 'mongoose';
import {IProduct} from "../../../src/models/Product";

export interface IProductDB extends IProduct {
    id?: ObjectId;
}

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    categories: {
        type: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Category'}]
    },
    price: {
        type: Number,
        required: true
    },
    image_src: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    description: {
        type: String
    },
    views: {
        type: Number
    },
});

export const Product = mongoose.model<IProductDB>("Product", productSchema);
