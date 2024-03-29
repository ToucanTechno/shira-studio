import {Request, Response } from "express";
import { validationResult } from "express-validator";
import { Product, IProductDB } from "../models/Product";

export const getProducts = async (req: Request, res: Response) => {
    console.log("get products", req.params);
    try {
        const skip = Math.max(0, parseInt(req.query["skip"] as string) || 0);
        // Forbid limit=0 since it requests all entries
        const limit = Math.max(1, Math.min(parseInt(req.query["limit"] as string) || 10, 50));
        // TODO: add sort as a parameter
        const [products, productsCount] = await Promise.all([
            Product.find().sort({ date: -1 }).skip(skip).limit(limit),
            Product.countDocuments()
        ]);

        res.status(200).send({ products: products, total: productsCount });
    } catch (error: any) {
        res.status(500).send(error.message);
    }
};

export const getSingleProduct = async (req: Request, res: Response) => {
    const id = req.params['id'];
    console.log("get single product");
    try {
        if (!id) {
            throw new Error("Missing product ID");
        }
        const product = await Product.findById(id);
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
            category_id: product.category_id,
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
        const result = await Product.updateOne({'_id': id}, req.body);

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
        const result = await Product.deleteOne({ '_id': id });

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
