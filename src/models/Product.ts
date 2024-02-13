export interface IProduct {
    product_id: string;
    name: string;
    category_id: string;
    price: number;
    image_src: string;
    date?: Date;
    stock?: number;
    description: string;
    views?: number;
}