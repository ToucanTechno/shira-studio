import {Request, Response } from "express";
import { validationResult } from "express-validator";
import { Product, IProductDB } from "../models/Product";
import { Category } from "../models/Category";
import mongoose, { ObjectId } from "mongoose";

export const getProducts = async (req: Request, res: Response) => {
    console.log("get products", req.params, req.query['skip'], req.query['limit']);
    try {
        const skip = Math.max(0, parseInt(req.query["skip"] as string) || 0);
        // Forbid limit=0 since it requests all entries
        const limit = Math.max(1, Math.min(parseInt(req.query["limit"] as string) || 10, 50));
        // TODO: add sort as a parameter
        const [products, productsCount] = await Promise.all([
            Product.find().populate('categories').sort({ date: -1 }).skip(skip).limit(limit),
            Product.countDocuments()
        ]);

        res.status(200).send({ products: products, total: productsCount });
    } catch (error: any) {
        res.status(500).send(error.message);
    }
};

export const getSingleProduct = async (req: Request, res: Response) => {
    const id = req.params['id'];
    console.log("get single product", req.params);
    try {
        if (!id) {
            throw new Error("Missing product ID");
        }
        const product = await Product.findById(id).populate('categories');
        if (!product) {
            res.status(404).send({ message: `Unable to find matching product with id: ${req.params['id']}` });
            return;
        }
        res.status(200).send(product);
    } catch (error: any) {
        res.status(400).send(error.message);
    }
};

export const insertProduct = async (req: Request, res: Response) => {
    const product: IProductDB = req.body;
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).send({message: "Failed validation", errors: errors.array()});
            return
        }
        const productObj = new Product({
            name: product.name,
            categories: product.categories, //TODO: make sure that it checks its valid ref to categories and update categories as well
            price: product.price,
            image_src: product.image_src,
            date: Date.now(),
            stock: product.stock,
            description: product.description,
            views: 0});

        const result = await productObj.save();
        res.status(201).send({message: "Product inserted successfully.", id:result._id});
    } catch(error) {
        res.status(401).send({message: error});
        return;
    }
};

export const updateProduct = async (req: Request, res: Response) => {
    // This function assumes admin authorization so the interface is not strict.
    try {
        if (!req.params['id']) {
            throw new Error("Invalid product ID");
        }
        const id = req.params['id'];
        // TODO: add validations to req.body
        const result = await Product.updateOne({'_id': id}, req.body);//TODO: add check for categories change

        if (result && result.modifiedCount === 1) {
            res.status(200).send(`Successfully updated product with id ${id}`)
        } else {
            res.status(304).send(`Product with id: ${id} not updated`);
        }
    } catch (error: any) {
        console.error(error.message);
        res.status(400).send(error.message);
    }
};

export const deleteProduct = async (req: Request, res: Response) => {
    try {
        if (!req.params['id']) {
            throw new Error("Invalid product ID");
        }
        const id = req.params['id'];
        const result = await Product.deleteOne({ '_id': id }); //TODO: add check for categories change

        if (result && result.deletedCount === 1) {
            res.status(202).send(`Successfully removed product with id ${id}`);
        } else if (!result) {
            res.status(400).send(`Failed to remove product with id ${id}`);
        } else {
            res.status(404).send(`Product with id ${id} does not exist`);
        }
    } catch (error: any) {
        console.error(error.message);
        res.status(400).send(error.message);
    }
};


async function changeProdMulLogic(actionType:string, categories:Array<ObjectId>, productObj: mongoose.Document<unknown, {}, IProductDB> & IProductDB ){
    const promiseArr = []
    if(actionType === 'add'){
        for (const elm of categories){
            const category = await Category.findOne({name:elm});//this is the double call can be saved
            if(!productObj.categories.includes(category?.id)){//ignore if wanted to add category that already in the product 
                productObj.categories.push(category?.id);
                category?.products.push(productObj?.id);
                promiseArr.push(category?.save());
            }
        }
    }
    else {
        for(const elm of categories){
            const category = await Category.findOne({name:elm});//this is the double call can be saved
            const categoryIndex = productObj.categories.indexOf(category?.id)
            if(categoryIndex !== -1){//ignore if wanted to delete product that not in the category 
                productObj?.categories.splice(categoryIndex,1);
                category?.products.splice(category?.products.indexOf(productObj.id),1);
                promiseArr.push(category?.save());
            }
        }
    }
    promiseArr.push(productObj?.save());
    Promise.all(promiseArr);
}

// TODO (CR): called changeProd but better name would be changeCategoriesOfProduct
// was surprised to find this changes both products and categories. Maybe find a better name?
export const changeProdMul = async (req:Request, res:Response) => {
    const categories:Array<any> = req.body['names'];
    const productId = req.params['id'];
    const actionType = req.body['action'];
    console.log(`updating categories ${categories} of product ${productId}`)
    if(!categories) {
        console.log('missing categories')
        res.status(400).send('missing category name');
    }
    else if(!productId) {
        console.log('missing productId')
        res.status(400).send('missing product id');
    }
    else if (actionType !== 'add' && actionType !== 'del') {
        console.log('missing action type')
        res.status(400).send('missing action type send add/del');
    }
    else {
        const invalidIds = []
        for(const category of categories){
            if(!await Category.findOne({name:category})){
                invalidIds.push(category)
            }
        }
        if(invalidIds.length > 0){
            res.status(400).send('couldn\'t find categories with ids: ' + invalidIds);
        }
        else {
            const prodObj = await Product.findById(productId)
            if (!prodObj){
                res.status(400).send('could not find category with name: ' + categories);
                return;
            }
            await changeProdMulLogic(actionType,categories,prodObj)
            res.status(200).send('change successful')
        }
    }
}
