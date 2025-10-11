import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

// Get MongoDB connection string
let connectionString = 'mongodb://mongo:EpTmcvrPaEpGKjAVeMWaCDaWWbOcZxBR@shortline.proxy.rlwy.net:52833';
const dbName = process.env.DB_NAME || 'shira-studio';

if (!connectionString.endsWith('/')) {
    connectionString += '/';
}
connectionString += dbName;
connectionString += '?authSource=admin';

console.log('🔌 Connecting to MongoDB...');

// Connect to MongoDB
await mongoose.connect(connectionString);
console.log('✅ Connected to MongoDB successfully\n');

// Define Product schema (minimal version for this script)
const productSchema = new mongoose.Schema({
    name: String,
    stock: Number,
    price: Number,
    category: mongoose.Schema.Types.ObjectId
}, { strict: false });

const Product = mongoose.model('Product', productSchema);

async function fixMissingStock() {
    try {
        console.log('🔍 Fetching all products to check stock values...\n');
        
        // Get all products (we'll check them in JavaScript to avoid Mongoose casting issues)
        const allProducts = await Product.find({}).lean();
        
        console.log(`📊 Found ${allProducts.length} total products\n`);
        
        // Find products with invalid stock
        const productsToFix = [];
        for (const product of allProducts) {
            const stock = product.stock;
            // Check if stock is missing, null, undefined, or NaN
            if (stock === undefined || stock === null || (typeof stock === 'number' && isNaN(stock))) {
                productsToFix.push(product);
            }
        }
        
        console.log(`📊 Found ${productsToFix.length} products with invalid stock\n`);
        
        if (productsToFix.length === 0) {
            console.log('✅ All products have valid stock values!');
            return;
        }
        
        // Update each product
        let updatedCount = 0;
        for (const product of productsToFix) {
            console.log(`📦 Updating product: ${product.name || product._id}`);
            console.log(`   Current stock: ${product.stock}`);
            
            // Use updateOne with $set to force the value
            await Product.updateOne(
                { _id: product._id },
                { $set: { stock: 1 } }
            );
            updatedCount++;
            
            console.log(`   ✅ Updated stock to: 1\n`);
        }
        
        console.log(`\n✅ Successfully updated ${updatedCount} products!`);
        
        // Verify the fix
        const verifyProducts = await Product.find({}).lean();
        const remainingIssues = verifyProducts.filter(p => {
            const stock = p.stock;
            return stock === undefined || stock === null || (typeof stock === 'number' && isNaN(stock));
        });
        
        if (remainingIssues.length === 0) {
            console.log('✅ Verification passed: All products now have valid stock values!');
        } else {
            console.log(`⚠️  Warning: ${remainingIssues.length} products still have invalid stock`);
            remainingIssues.forEach(p => {
                console.log(`   - ${p.name || p._id}: stock = ${p.stock}`);
            });
        }
        
    } catch (error) {
        console.error('❌ Error fixing missing stock:', error);
        throw error;
    }
}

// Run the fix
await fixMissingStock();

// Close connection
await mongoose.connection.close();
console.log('\n🔌 Disconnected from MongoDB');
process.exit(0);