import express from "express";
import {
    ProductUpload,
    uploadProductImages,
    deleteProductImage,
    reorderProductImages,
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
// Upload multiple images to a product (Cloudinary)
productsRouter.post('/:id/images', ProductUpload.array('images', 10), uploadProductImages, productUploadErr);

// PUT
productsRouter.put('/:id', updateProduct);
productsRouter.put("/:id/categories", changeCategoriesOfProduct);

// DELETE
productsRouter.delete('/:id', deleteProduct);
// Delete a specific image from a product
productsRouter.delete('/:id/images/:imageId', deleteProductImage);

// PUT - Reorder images
productsRouter.put('/:id/images/reorder', reorderProductImages);
