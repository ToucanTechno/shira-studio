import {NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { Product, IProductDB } from "../models/Product";
import { Category } from "../models/Category";
import mongoose, {  ObjectId } from "mongoose";
import multer from "multer"
import { ResponseError ,ErrorDocNotDeleted,ErrorDocNotFound, ErrorDocNotUpdated, ErrorWrongFileType, ErrorUseDedicatedUpdate } from "../utils/error";
import { RequestValidator } from "../utils/validator";
import { isDocNotFoundById, isInvalidObjId, isInvalidType, isMissingField } from "../utils/paramChecks";
import ImageUploadService from "../services/imageUploadService";



//how to send multiple files for multer to look at
//https://stackoverflow.com/questions/39350040/uploading-multiple-files-with-multer


// Multer memory storage for Cloudinary upload
const storage = multer.memoryStorage();

const fileFilter = function(_req: Request, file: Express.Multer.File, cb: any) {
    const fileType = file.mimetype.split('/');
    const fileExtension = fileType[1];
    if(fileType[0] !== 'image' || !fileExtension || !['jpeg', 'jpg', 'png', 'webp'].includes(fileExtension)) {
        cb(new ErrorWrongFileType('image', ['jpeg', 'jpg', 'png', 'webp']));
    } else {
        cb(null, true);
    }
}

export const ProductUpload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Upload multiple images to a product
export const uploadProductImages = async (req: Request, res: Response) => {
    try {
        const productId = req.params['id']!;
        
        // Validate product exists
        const err = await RequestValidator.validate([
            {name: 'id', validationFuncs: [
                isMissingField.bind(null, productId),
                isInvalidObjId.bind(null, productId),
                isDocNotFoundById.bind(null, productId, Product)
            ]}
        ]);
        
        if (err) {
            err.send(res);
            return;
        }

        const files = req.files as Express.Multer.File[];
        if (!files || files.length === 0) {
            res.status(400).send({ message: 'No files provided' });
            return;
        }

        const result = await ImageUploadService.uploadMultipleImages(files);

        if (result.errors.length > 0 && result.images.length === 0) {
            res.status(400).send({
                message: 'Failed to upload images',
                errors: result.errors
            });
            return;
        }

        // Update product with new images
        const product = await Product.findById(productId);
        if (!product) {
            res.status(404).send({ message: 'Product not found' });
            return;
        }

        // Add new images to existing ones
        const existingImagesCount = product.images?.length || 0;
        const newImages = result.images.map((img: any, index: number) => ({
            url: img.url,
            public_id: img.public_id,
            order: existingImagesCount + index,
            alt_text: `${product.name} - Image ${existingImagesCount + index + 1}`
        }));

        product.images = [...(product.images || []), ...newImages];
        await product.save();

        res.status(200).send({
            message: 'Images uploaded successfully',
            images: newImages
        });
    } catch (error: any) {
        res.status(500).send({ message: error.message });
    }
};

// Delete a specific image from a product
export const deleteProductImage = async (req: Request, res: Response) => {
    try {
        const productId = req.params['id']!;
        const imageId = req.params['imageId']!;

        const err = await RequestValidator.validate([
            {name: 'id', validationFuncs: [
                isMissingField.bind(null, productId),
                isInvalidObjId.bind(null, productId),
                isDocNotFoundById.bind(null, productId, Product)
            ]}
        ]);

        if (err) {
            err.send(res);
            return;
        }

        const product = await Product.findById(productId);
        if (!product) {
            res.status(404).send({ message: 'Product not found' });
            return;
        }

        // Find image by matching the last part of public_id (the actual image ID)
        const imageIndex = product.images?.findIndex(img => {
            const storedImageId = img.public_id.split('/').pop();
            return storedImageId === imageId;
        });
        
        if (imageIndex === undefined || imageIndex === -1 || !product.images) {
            res.status(404).send({ message: 'Image not found' });
            return;
        }

        // Get the full public_id for Cloudinary deletion
        const imageToDelete = product.images[imageIndex];
        if (!imageToDelete) {
            res.status(404).send({ message: 'Image not found' });
            return;
        }
        const fullPublicId = imageToDelete.public_id;
        
        // Delete from Cloudinary using the full public_id
        const result = await ImageUploadService.deleteImage(fullPublicId);

        if (!result.success) {
            res.status(500).send({ message: result.error });
            return;
        }

        // Remove from product
        product.images?.splice(imageIndex, 1);
        
        // Reorder remaining images
        product.images?.forEach((img, index) => {
            img.order = index;
        });

        await product.save();

        res.status(200).send({ message: 'Image deleted successfully' });
    } catch (error: any) {
        res.status(500).send({ message: error.message });
    }
};

// Reorder product images
export const reorderProductImages = async (req: Request, res: Response) => {
    try {
        const productId = req.params['id']!;
        const { imageOrders } = req.body; // Array of { public_id, order }

        const err = await RequestValidator.validate([
            {name: 'id', validationFuncs: [
                isMissingField.bind(null, productId),
                isInvalidObjId.bind(null, productId),
                isDocNotFoundById.bind(null, productId, Product)
            ]}
        ]);

        if (err) {
            err.send(res);
            return;
        }

        if (!imageOrders || !Array.isArray(imageOrders)) {
            res.status(400).send({ message: 'Invalid imageOrders format' });
            return;
        }

        const product = await Product.findById(productId);
        if (!product) {
            res.status(404).send({ message: 'Product not found' });
            return;
        }

        // Update order for each image
        imageOrders.forEach((orderItem: { public_id: string, order: number }) => {
            const image = product.images?.find(img => img.public_id === orderItem.public_id);
            if (image) {
                image.order = orderItem.order;
            }
        });

        // Sort images by order
        product.images?.sort((a, b) => a.order - b.order);

        await product.save();

        res.status(200).send({
            message: 'Images reordered successfully',
            images: product.images
        });
    } catch (error: any) {
        res.status(500).send({ message: error.message });
    }
};

//TODO: err:any should be of type Error that we created or error that is thrown from multer
export const productUploadErr = (err: any, _req: Request, res: Response, _next: NextFunction) => {
    if (err instanceof ResponseError) {
        err.send(res);
    } else {
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
        let filter: any = {};
        let category = null;
        if (categoryName) {
            // Find the category by name to get its ID
            category = await Category.findOne({ name: categoryName });
            if (category) {
                // Use the ObjectId directly - categories are stored as ObjectIds in the database
                filter = { categories: category._id };
                
            } else {
                console.log(`Category "${categoryName}" not found in database`);
                // Return empty result set if category doesn't exist
                res.status(200).send({ products: [], total: 0 });
                return;
            }
        }
        
        // TODO: add sort as a parameter
        const [products, productsCount] = await Promise.all([
            Product.find(filter).populate('categories').sort({ date: -1 }).skip(skip).limit(limit),
            Product.countDocuments(filter)
        ]);

        res.status(200).send({ products: products, total: productsCount });
    } catch (error: any) {
        console.error('Error in getProducts:', error);
        // Always return proper structure even on error
        res.status(500).send({ products: [], total: 0, error: error.message });
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
            images: product.images || [],
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
    // Check matchedCount instead of modifiedCount - if document was found, operation succeeded
    // modifiedCount can be 0 if updating with same values, which is still a successful operation
    if (result && result.matchedCount >= 1) {
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
