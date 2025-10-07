// Frontend type definitions - no backend imports allowed
export interface ICategory {
    name: string;
    text: string;
    parent: string;
    products?: Array<string>;
    _id?: string;
}

export interface IProduct {
    product_id: string;
    name: string;
    categories: Array<ICategory | string>;
    price: number;
    image_src: string;
    created?: Date;
    modified?: Date;
    stock: number;
    description: string;
    views?: number;
    _id?: string;
}
