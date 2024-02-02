// External Dependencies
import * as mongoDB from "mongodb";
import * as dotenv from "dotenv";
import Product from "../models/Product";

// Global Variables
export const collections: { products?: mongoDB.Collection<Product> } = {}

// Initialize Connection
export async function connectToDatabase () {
    dotenv.config();
    const client: mongoDB.MongoClient = new mongoDB.MongoClient(process.env["DB_CONN_STRING"] as string);
    await client.connect();
    const db: mongoDB.Db = client.db(process.env["DB_NAME"] as string);
    const productsCollection: mongoDB.Collection<Product> = db.collection(process.env["PRODUCTS_COLLECTION_NAME"] as string);
    collections.products = productsCollection;
    console.log(`Successfully connected to database: ${db.databaseName} and collection: ${productsCollection.collectionName}`);
}
