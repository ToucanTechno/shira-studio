import {ICategory} from "../../backend/src/models/Category"
import mongoose from 'mongoose';
export interface IProduct {
    product_id: string;
    name: string;
    categories: Array<ICategory | mongoose.Schema.Types.ObjectId>;
    price: number;
    image_src: string;
    created?: Date;
    modified?: Date;
    stock: number;
    description: string;
    views?: number;
    _id?: string;
}
