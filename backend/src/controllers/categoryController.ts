import { Category, ICategory } from "../models/Category";
import {Request, Response } from "express";
import { Product } from "../models/Product";
import mongoose, { ObjectId } from "mongoose";


export const insertCategory = async (req: Request, res: Response) => {
    const name:string = req.body['name'];
    const parent = req.body['parent'] ? req.body['parent'] : '' //'' for main parent category
    console.log(parent)
    if (name === undefined ) {
        res.status(400).send('missing category name');
        return    
    }
    else if(await Category.findOne({name:name})) {
        res.status(400).send('category already exist');
        return    
    }
    else if(parent !== '' && !await Category.findOne({name:parent})){
        res.status(400).send('no parent category');
        return
    }
    const categoryObj = new Category({name: name, parent:parent});
    const result = await categoryObj.save();
    res.status(201).send({message: "category created successfully.", id:result._id});
};

export const getAllCategories = async (_req:Request, res:Response) => {
    const categories = (await Category.find()).map((category) => category.name)//find() is ok here because categories number is small
    res.status(200).send(categories);
}

//to get the main parent category need to send None as name
export const getCategoryByParent = async (req: Request, res: Response) => {
    let name = req.params['name'];
    if(name === undefined){
        res.status(400).send('missing category name')
        return;
    }
    if(name === 'None')//this is because cant have /parent/ to get main parent categories
        name = '';
    const categories = (await Category.find({parent:name})).map((category) => category.name)
    res.status(200).send(categories);
}

async function changeCatMulLogic(actionType:string, products:Array<ObjectId>, categoryObj: mongoose.Document<unknown, {}, ICategory> & ICategory ){
    const promiseArr = []
    if(actionType === 'add'){
        for (const elm of products){
            if(!categoryObj.products.includes(elm)){//ignore if wanted to add product that already in the category 
                categoryObj.products.push(elm);
                const prod = await Product.findById(elm);//this is the double call can be saved
                prod?.categories.push(categoryObj?.id);
                promiseArr.push(prod?.save());
            }
        }
    }
    else {
        for(const elm of products){
            const productIndex = categoryObj.products.indexOf(elm)
            if(productIndex !== -1){//ignore if wanted to delete product that not in the category 
                categoryObj?.products.splice(productIndex,1);
                const prod = await Product.findById(elm);//this is the double call can be saved
                prod?.categories.splice(prod?.categories.indexOf(categoryObj.id),1);
                promiseArr.push(prod?.save());
            }
        }
    }
    promiseArr.push(categoryObj?.save());
    Promise.all(promiseArr);
}

export const changeCatMul = async (req:Request, res:Response) => {
    const categoryName = req.params['name'];
    const products: Array<any> = req.body['products'];
    const actionType = req.body['action'];
    if(!categoryName) {
        res.status(400).send('missing category name');
    }
    else if(!products) {
                res.status(400).send('missing products');
    }
    else if (actionType !== 'add' && actionType !== 'del') {
        res.status(400).send('missing action type send add/del');
    }
    else {
        const invalidIds = []
        for(const prod of products){
            if(!await Product.findById(prod)){
                invalidIds.push(prod)
            }
        }
        if(invalidIds.length > 0){
            res.status(400).send('couldn\'t find products with ids: ' + invalidIds);
        }
        else {
            const categoryObj = await Category.findOne({name:categoryName});
            if (!categoryObj){
                res.status(400).send('could not find category with name: ' + categoryName);
                return;
            }
            await changeCatMulLogic(actionType,products,categoryObj)
            res.status(200).send('change successful')
        }
    }
}
