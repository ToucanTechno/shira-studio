import {IProduct} from "./Product";


export interface ProductOrderModel {
    product:IProduct;
    amount:number;
};

// TODO: refactor interface types
export interface ICartModel {
    userId: string;
    products: {[key: string]: ProductOrderModel};
    createdAt?: string;
    updatedAt?: string; //TODO: add accessedAt so we can delete cart more gracefully
    lock: boolean;
    lockedAt?: string;
    lockExpiresAt?: string;
}
