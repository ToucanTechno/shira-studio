import { ObjectId } from 'mongoose';

export default class Product {
    constructor(public name: string,
                public category_id: number,
                public price: number,
                public description: string,
                public id?: ObjectId) {
    }
}
