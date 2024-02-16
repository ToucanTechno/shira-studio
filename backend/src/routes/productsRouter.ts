import express from "express";
import {
    deleteProduct,
    getProducts,
    getSingleProduct,
    insertProduct,
    updateProduct
} from "../controllers/productsController";

// Global Config
export const productsRouter = express.Router();

productsRouter.use(express.json());

// GET
productsRouter.get('/:id', getSingleProduct);
productsRouter.get('/', getProducts);
productsRouter.get('/c/:category/:subcategory/', getProducts);
productsRouter.get('/c/:category/', getProducts);

// POST
// TODO: add admin authentication check for insert, update, delete
productsRouter.post('/', insertProduct);

// PUT
productsRouter.put('/:id', updateProduct);

// DELETE
productsRouter.delete('/:id', deleteProduct);
