import {NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { Product, IProductDB } from "../models/Product";
import { Category } from "../models/Category";
import mongoose, {  ObjectId } from "mongoose";
import multer from "multer"
import { ResponseError ,ErrorDocNotDeleted,ErrorDocNotFound, ErrorDocNotUpdated, ErrorInvalidObjectId, ErrorWrongFileType, ErrorUseDedicatedUpdate } from "../utils/error";
import { RequestValidator } from "../utils/validator";
import { isDocNotFoundById, isInvalidObjId, isInvalidType, isMissingField } from "../utils/paramChecks";



//how to send multiple files for multer to look at
//https://stackoverflow.com/questions/39350040/uploading-multiple-files-with-multer


const storage = multer.diskStorage({
    destination: function (_req:Request, _file, cb) {
        cb(null, process.cwd() + '/products')//TODO:when on actual server use better path
    },
    filename: function (_req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fileName = file.fieldname + '-' + uniqueSuffix + '.' + file.mimetype.split('/')[1];//filtering to image so extension is at [1]
        cb(null, fileName)
    }, 
});
const fileFilter = async function(req: Request, file: Express.Multer.File, cb: any) {
    const fileType = file.mimetype.split('/');
    const productId = req.params['id']!;
    if(fileType[0] !== 'image'  || (fileType[1] !== 'jpeg' && fileType[1] !== 'jpg' && fileType[1] !== 'png')) {
        cb(new ErrorWrongFileType('image',['jpeg','jpg','png']));
    }
    else if(!mongoose.isValidObjectId(productId)){
        cb(new ErrorInvalidObjectId(productId,'id'));
    }
    else if(!await Product.findById(productId)){
        cb(new ErrorDocNotFound(Product.modelName,productId));
    }
    else{
        cb(null,true);
    }

}
export const ProductUpload = multer({ storage: storage, fileFilter: fileFilter});

//think what to do about if we change picture do we delete the changed picture? currently it only replace the link to the image
export const ProductUploadLogic = async (req:Request,res:Response) =>{
    const productId = req.params['id'];
    const product = (await Product.findById(productId))!;    
    product.image_src = req.file!.filename;
    await product.save();
    res.status(200).send('upload completed');
}
//TODO: err:any should be of type Error that we created or error that is thrown from multer
export const productUploadErr = (err: any, _req: Request, res: Response,_next:NextFunction) => {
    if (err instanceof ResponseError){
        err.send(res);
    }
    else {
        res.status(400).send(err.message);
    }
}

export const getProducts = async (req: Request, res: Response) => {
    console.log("get products", req.params, req.query['skip'], req.query['limit'], req.query['category']);
    try {
        // TODO: should replace with Range HTTP header
        const skip = Math.max(0, parseInt(req.query["skip"] as string) || 0);
        // Forbid limit=0 since it requests all entries
        const limit = Math.max(1, Math.min(parseInt(req.query["limit"] as string) || 10, 50));
        const categoryName = req.query["category"] as string;
        
        // Build query filter
        let filter = {};
        if (categoryName) {
            // Find the category by name to get its ID
            const category = await Category.findOne({ name: categoryName });
            if (category) {
                filter = { categories: category._id };
            }
        }
        
        // TODO: add sort as a parameter
        const [products, productsCount] = await Promise.all([
            Product.find(filter).populate('categories').sort({ date: -1 }).skip(skip).limit(limit),
            Product.countDocuments(filter)
        ]);

        res.status(200).send({ products: products, total: productsCount });
    } catch (error: any) {
        res.status(500).send(error.message);
    }
};

export const getSingleProduct = async (req: Request, res: Response) => {
    const id = req.params['id']!;//! tells compiler that it cant be undefined cant call this function if id is undefined
    const err = await RequestValidator.validate(
        [{name:'id',validationFuncs:[isMissingField.bind(null,id),isInvalidObjId.bind(null,id),isDocNotFoundById.bind(null,id,Product)]}]
    )
    if(err){
        err.send(res)
        return
    }
    const product = await Product.findById(id).populate('categories');
    res.status(200).send(product);
};

//TODO:make sure that the new product fields are validated currently it doesn't check fields
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
    const id = req.params['id']!;
    const err = await RequestValidator.validate(
        [{name:'id',validationFuncs:[isMissingField.bind(null,id),isInvalidObjId.bind(null,id),isDocNotFoundById.bind(null,id,Product)]}]
    )
    if(err){
        err.send(res)
        return
    }
    if(req.body['categories']){
        new ErrorUseDedicatedUpdate('categories').send(res);
        return;
    }
    // TODO: add validations to req.body not sure how to properly validate need to iterate over all vars and check if exist in Product
    //there is no way to check how many fields been updated so on validation to check existence of fields
    const result = await Product.updateOne({'_id': id}, req.body);
    if (result  && result.modifiedCount >= 1) { //the modifiedcount is to make sure because i cant think of a way to test update fail
        res.status(200).send(`Successfully updated product with id ${id}`)
    } else {
        new ErrorDocNotUpdated(id,req.body).send(res);
    }
};

export const deleteProduct = async (req: Request, res: Response) => {
    const id = req.params['id']!;
    const err = await RequestValidator.validate(
        [{name:'id',validationFuncs:[isMissingField.bind(null,id),isInvalidObjId.bind(null,id),isDocNotFoundById.bind(null,id,Product)]}]
    )
    if(err){
        err.send(res)
        return
    }
    const result = await Product.deleteOne({ '_id': id }); //TODO: add check for categories change
    // TODO: make sure there are no orders with this product
    // TODO: delete it from all categories that have this product

    if (result && result.deletedCount === 1) {//the modified count is to make sure same as above in updateProduct 
        res.status(200).send(`Successfully removed product with id ${id}`);
    } else if (!result) {
        new ErrorDocNotDeleted(id).send(res);
    }
};


async function changeCategoriesOfProductLogic(removeAction:boolean, categories:Array<ObjectId>, 
                                              productObj: mongoose.Document<any,any,IProductDB> & IProductDB ){
    const promiseArr = []
    if(removeAction === false){
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


//exist | correct type | filter | 

//changes action from string type to be field removeAction and from type boolean 
export const changeCategoriesOfProduct = async (req:Request, res:Response) => {
    const productId = req.params['id']!;
    const categories:Array<any> = req.body['names'];
    const removeAction:boolean = req.body['removeAction'];
    const err = await RequestValidator.validate(
        [{name: 'id',validationFuncs: [isMissingField.bind(null,productId),isInvalidObjId.bind(null,productId),
                                       isDocNotFoundById.bind(null,productId,Product)]},
         {name: 'names',validationFuncs: [isMissingField.bind(null,categories)]},
         {name: 'removeAction',validationFuncs: [isMissingField.bind(null,removeAction),isInvalidType.bind(null,removeAction,'boolean')]}
        ]
    )
    if(err){
        err.send(res)
        return
    }
    for(const category of categories){
        if(!await Category.findOne({name:category})){
            new ErrorDocNotFound(Category.modelName,category).send(res)
            return
        }
    }
    const prodObj = await Product.findById(productId)
    await changeCategoriesOfProductLogic(removeAction,categories,prodObj!)
    res.status(200).send('change successful')
}
