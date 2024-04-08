import mongoose from 'mongoose';
import { IProduct } from '../../../src/models/Product';

export interface ICategory {
    name: string;
    parent: string
    products: Array<IProduct | mongoose.Schema.Types.ObjectId>
}

const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
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

export const Category = mongoose.model<ICategory>("categories", CategorySchema);
