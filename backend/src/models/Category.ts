import mongoose from 'mongoose';
import { IProduct } from '../../../src/models/Product';

export interface ICategory {
    name: string;
    text: string;
    parent: string
    products: Array<IProduct | mongoose.Schema.Types.ObjectId>
    _id?: string;
}

const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    text: {
        type: String,
    },
    parent: {
        type: String
    },
    products: {
        type: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product'}]
    }
});

export const Category = mongoose.model<ICategory>("Category", CategorySchema);
