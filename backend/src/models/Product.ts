import mongoose, { ObjectId } from 'mongoose';

export interface IProduct {
    name: string;
    categories: Array<mongoose.Schema.Types.ObjectId>;
    price: number;
    image_src: string;
    date?: Date;
    stock: number;
    description?: string;
    views?: number;
}

export interface IProductDB extends IProduct {
    _id?: ObjectId;
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
