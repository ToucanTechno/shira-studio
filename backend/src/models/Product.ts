import mongoose, { ObjectId } from 'mongoose';

export interface IProductImage {
    url: string;
    public_id: string;
    order: number;
    alt_text?: string;
}

export interface IProduct {
    name: string;
    categories: Array<mongoose.Schema.Types.ObjectId>;
    price: number;
    images: IProductImage[];
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
    images: [{
        url: {
            type: String,
            required: true
        },
        public_id: {
            type: String,
            required: true
        },
        order: {
            type: Number,
            required: true,
            default: 0
        },
        alt_text: {
            type: String,
            default: ''
        }
    }],
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
