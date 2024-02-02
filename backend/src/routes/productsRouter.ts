import express, { Request, Response } from 'express';
import { ObjectId, Collection } from 'mongodb';
import { collections } from '../services/databaseService';
import Product from '../models/Product';

// Global Config
export const productsRouter = express.Router();

productsRouter.use(express.json());

// GET
productsRouter.get('/', async (_req: Request, res: Response) => {
    try {
        const products = (await (collections.products as Collection<Product>).find({}).toArray()) as Product[];

        res.status(200).send(products);
    } catch (error: any) {
        res.status(500).send(error.message);
    }
});

productsRouter.get('/:id', async (req: Request, res: Response) => {
    const id = req?.params['id'];

    try {

        const query = { _id: new ObjectId(id) };
        const product = (await (collections.products as Collection<Product>).findOne(query)) as Product;

        if (product) {
            res.status(200).send(product);
        }
    } catch (error) {
        res.status(404).send(`Unable to find matching document with id: ${req.params['id']}`);
    }
});

// POST
productsRouter.post('/', async (req: Request, res: Response) => {
    try {
        const newProduct = req.body as Product;
        const result = await (collections.products as Collection<Product>).insertOne(newProduct);

        result
            ? res.status(201).send(`Successfully created a new product with id ${result.insertedId}`)
            : res.status(500).send("Failed to create a new product.");
    } catch (error: any) {
        console.error(error);
        res.status(400).send(error.message);
    }
});

// PUT
productsRouter.put('/:id', async (req: Request, res: Response) => {
    const id = req?.params['id'];

    try {
        const updatedProduct: Product = req.body as Product;
        const query = { _id: new ObjectId(id) };

        const result = await (collections.products as Collection<Product>).updateOne(query, { $set: updatedProduct });

        result
            ? res.status(200).send(`Successfully updated product with id ${id}`)
            : res.status(304).send(`Product with id: ${id} not updated`);
    } catch (error: any) {
        console.error(error.message);
        res.status(400).send(error.message);
    }
});

// DELETE
productsRouter.delete('/:id', async (req: Request, res: Response) => {
    const id = req?.params['id'];

    try {
        const query = { _id: new ObjectId(id) };
        const result = await (collections.products as Collection<Product>).deleteOne(query);

        if (result && result.deletedCount) {
            res.status(202).send(`Successfully removed product with id ${id}`);
        } else if (!result) {
            res.status(400).send(`Failed to remove product with id ${id}`);
        } else if (!result.deletedCount) {
            res.status(404).send(`Product with id ${id} does not exist`);
        }
    } catch (error: any) {
        console.error(error.message);
        res.status(400).send(error.message);
    }
});
