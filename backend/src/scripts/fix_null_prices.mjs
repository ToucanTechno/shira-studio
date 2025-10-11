import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '../../.env') });

// Get base connection string
let connectionString = 'mongodb://mongo:EpTmcvrPaEpGKjAVeMWaCDaWWbOcZxBR@shortline.proxy.rlwy.net:52833/';

// Add database name
const dbName = process.env.DB_NAME || 'shira-studio';

// Ensure connection string ends with / before adding database name
if (!connectionString.endsWith('/')) {
    connectionString += '/';
}
connectionString += dbName;

// Railway MongoDB requires authSource=admin for authentication
connectionString += '?authSource=admin';

console.log('Using MongoDB URI:', connectionString);

async function fixNullPrices() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(connectionString);
        console.log('Connected successfully\n');

        const db = mongoose.connection.db;
        const productsCollection = db.collection('products');

        // Find all products with null or undefined price
        console.log('Searching for products with null prices...\n');
        const productsWithNullPrice = await productsCollection.find({
            $or: [
                { price: null },
                { price: { $exists: false } }
            ]
        }).toArray();

        console.log(`Found ${productsWithNullPrice.length} products with null prices\n`);

        if (productsWithNullPrice.length === 0) {
            console.log('No products need fixing!');
            return;
        }

        // Display products before fixing
        console.log('Products to be fixed:');
        productsWithNullPrice.forEach(product => {
            console.log(`  - ID: ${product._id}`);
            console.log(`    Name: ${product.name || 'N/A'}`);
            console.log(`    Current Price: ${product.price}`);
            console.log('');
        });

        // Update all products with null price to 1000
        const result = await productsCollection.updateMany(
            {
                $or: [
                    { price: null },
                    { price: { $exists: false } }
                ]
            },
            {
                $set: { price: 1000 }
            }
        );

        console.log('\n=== RESULTS ===');
        console.log(`Products matched: ${result.matchedCount}`);
        console.log(`Products updated: ${result.modifiedCount}`);
        console.log('All null prices have been set to 1000 ₪');

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.connection.close();
        console.log('\nDatabase connection closed');
    }
}

fixNullPrices();