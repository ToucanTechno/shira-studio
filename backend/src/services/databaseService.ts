// External Dependencies
import * as mongoDB from "mongodb";
import * as dotenv from "dotenv";

// Global Variables

// Initialize Connection
export async function connectToDatabase () {
    dotenv.config();
    const client: mongoDB.MongoClient = new mongoDB.MongoClient(process.env["MONGO_URL"] as string);
    await client.connect();
    const db: mongoDB.Db = client.db(process.env["DB_NAME"] as string);
    console.log(`Successfully connected to database: ${db.databaseName}`);
}
