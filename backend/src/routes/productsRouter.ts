import express from "express";
import {
    ProductUpload,
    ProductUploadLogic,
    changeCategoriesOfProduct,
    deleteProduct,
    getProducts,
    getSingleProduct,
    insertProduct,
    productUploadErr,
    updateProduct
} from "../controllers/productsController";

// Global Config
export const productsRouter = express.Router();

productsRouter.use(express.json());

// GET
productsRouter.get('/:id', getSingleProduct);
// TODO: get product position (for now only by ID)
productsRouter.get('/', getProducts);
//TODO filter by category and subcategory can use default as give all and if have value filter by that value
productsRouter.get('/c/:category/:subcategory/', getProducts);
productsRouter.get('/c/:category/', getProducts);

// POST
// TODO: add admin authentication check for insert, update, delete
productsRouter.post('/', insertProduct);
//TODO: currently there needs to be products file under the backend to save files to need a way to create it automatically 
productsRouter.post('/:id/upload',ProductUpload.single('product'),ProductUploadLogic).use(productUploadErr);

// PUT
productsRouter.put('/:id', updateProduct);
productsRouter.put("/:id/categories", changeCategoriesOfProduct);

// DELETE
productsRouter.delete('/:id', deleteProduct);
