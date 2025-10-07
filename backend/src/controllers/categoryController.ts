import { Category, ICategory } from "../models/Category";
import {Request, Response } from "express";
import { Product } from "../models/Product";
import mongoose, { ObjectId } from "mongoose";
import {RequestValidator} from "../utils/validator";
import {
    isDocAlreadyInDb,
    isDocNotFoundById,
    isDocNotFoundByParam, isInvalidObjId,
    isInvalidType,
    isMissingField
} from "../utils/paramChecks";


export const insertCategory = async (req: Request, res: Response) => {
    const name: string = req.body['name']
    const text: string = req.body['text']
    const parent = req.body['parent'] ? req.body['parent'] : '' //'' for main parent category
    const err = await RequestValidator.validate(
        [{name:'name',validationFuncs:[isMissingField.bind(null,name),isInvalidType.bind(null,name,"string"),
                                       isDocAlreadyInDb.bind(null,"name",name,Category)]},
         {name:'text',validationFuncs:[isMissingField.bind(null,text),isInvalidType.bind(null,text,"string")]},
         {name:'parent',validationFuncs:[isInvalidType.bind(null,parent,"string")]}
        ]
    )
    if(err){
        err.send(res)
        return
    }
    if(parent !== ''){ //to make sure this check is only done on parent that is not empty
        const err = await isDocNotFoundByParam("name",parent,Category,'')
        if(err){
            err.send(res)
            return
        }
    }
    const categoryObj = new Category({
        name: name,
        text: text,
        parent:parent
    })
    const result = await categoryObj.save()
    res.status(200).send({message: "category created successfully.", name:result.name})
};

export const getAllCategories = async (_req:Request, res:Response) => {
    const categories = (await Category.find()).map((category) => {
        const {__v: _, ...modifiedCategory}: any = category.toObject();
        return modifiedCategory;
    }) // find() is ok here because categories number is small
    res.status(200).send(categories);
}

// In order to get the main parent category, it is needed to send root as name
export const getCategoryByParent = async (req: Request, res: Response) => {
    let name = req.params['name'];
    const err = await RequestValidator.validate(
        [{name:'name',validationFuncs:[isMissingField.bind(null,name)]}]//cant check type because it always sends as string
    )
    if(err){
        err.send(res)
        return
    }
    if(name === 'root') // This is the easiest way to search for all categories that don't have parent
        name = '';
    const categories = (await Category.find({parent:name}).populate('products'))
        .map((category) => {
            const {__v: _, ...modifiedCategory}: any = category.toObject();//this is to remove the __v param
            return modifiedCategory;
        })
    res.status(200).send(categories);
}

// Get category info by name without populating products (more efficient)
export const getCategoryByName = async (req: Request, res: Response) => {
    const name = req.params['name'];
    const err = await RequestValidator.validate(
        [{name:'name',validationFuncs:[isMissingField.bind(null,name)]}]
    )
    if(err){
        err.send(res)
        return
    }
    const category = await Category.findOne({name: name}).select('-__v -products');
    if(!category){
        res.status(404).send({message: `Category with name "${name}" not found`});
        return;
    }
    res.status(200).send(category);
}

async function changeProductsLogic(addAction:boolean, products:Array<ObjectId>, categoryObj: mongoose.Document<unknown, {}, ICategory> & ICategory ){
    const promiseArr = []
    if(addAction){
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
    return Promise.all(promiseArr);
}

//changed action to removeAction and its boolean type true means add action false means remove action
export const changeProducts = async (req:Request, res:Response) => {
    const categoryName = req.params['name'];
    const products: Array<any> = req.body['products'];
    const addAction:boolean = req.body['addAction'];
    const err = await RequestValidator.validate(
        [
            {name:'name',validationFuncs:[isMissingField.bind(null,categoryName),
                                          isDocNotFoundByParam.bind(null,"name",categoryName,Category)]},
            {name:"products",validationFuncs:[isMissingField.bind(null,products)]},
            {name:"addAction",validationFuncs:[isMissingField.bind(null,addAction),
                                                  isInvalidType.bind(null,addAction,"boolean")]}
        ]
    )
    if(err){
        err.send(res)
        return
    }
    for(const prod of products){
        const err = await RequestValidator.validate([{name: "product",
            validationFuncs:[isInvalidObjId.bind(null,prod),isDocNotFoundById.bind(null,prod,Product)]}]);
        if(err){
            err.send(res)
            return
        }
    }
    const categoryObj = (await Category.findOne({name:categoryName}))!
    await changeProductsLogic(addAction,products,categoryObj)
    res.status(200).send('change successful')

}
