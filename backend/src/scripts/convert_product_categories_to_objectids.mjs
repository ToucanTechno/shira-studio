import { MongoClient, ObjectId } from 'mongodb';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

// Allow command-line override of database URL
const args = process.argv.slice(2);
const mongoUrl = args[0] || process.env.MONGO_URL || 'mongodb://localhost:27017/';
const dbName = args[1] || process.env.DB_NAME || 'shira-studio';

console.log(`\n🔗 Connecting to: ${mongoUrl.replace(/\/\/.*@/, '//***@')}`);
console.log(`📦 Database: ${dbName}\n`);

async function convertProductCategoriesToObjectIds() {
    const client = new MongoClient(mongoUrl + '?authSource=admin');
    
    try {
        await client.connect();
        console.log('✅ Connected to MongoDB');
        
        const db = client.db(dbName);
        const productsCollection = db.collection('products');
        
        // Get all products
        const products = await productsCollection.find({}).toArray();
        console.log(`\n📦 Found ${products.length} products`);
        
        let updatedCount = 0;
        let alreadyObjectIdCount = 0;
        let errorCount = 0;
        
        for (const product of products) {
            try {
                if (!product.categories || product.categories.length === 0) {
                    continue;
                }
                
                // Check if categories are already ObjectIds
                const firstCategory = product.categories[0];
                const isAlreadyObjectId = firstCategory instanceof ObjectId;
                
                if (isAlreadyObjectId) {
                    alreadyObjectIdCount++;
                    continue;
                }
                
                // Convert string categories to ObjectIds
                const convertedCategories = product.categories.map(catId => {
                    if (typeof catId === 'string') {
                        return new ObjectId(catId);
                    }
                    return catId;
                });
                
                // Update the product
                await productsCollection.updateOne(
                    { _id: product._id },
                    { $set: { categories: convertedCategories } }
                );
                
                updatedCount++;
                
                if (updatedCount % 100 === 0) {
                    console.log(`  Processed ${updatedCount} products...`);
                }
                
            } catch (error) {
                console.error(`❌ Error processing product ${product._id}:`, error.message);
                errorCount++;
            }
        }
        
        console.log('\n' + '='.repeat(80));
        console.log('📊 CONVERSION SUMMARY:');
        console.log(`  Total products: ${products.length}`);
        console.log(`  ✅ Converted: ${updatedCount}`);
        console.log(`  ⏭️  Already ObjectIds: ${alreadyObjectIdCount}`);
        console.log(`  ❌ Errors: ${errorCount}`);
        console.log('='.repeat(80));
        
        // Verify the conversion
        console.log('\n🔍 Verifying conversion...');
        const sampleProduct = await productsCollection.findOne({ 
            categories: { $exists: true, $ne: [] } 
        });
        
        if (sampleProduct) {
            console.log(`\nSample product: ${sampleProduct.name}`);
            console.log(`  Categories: ${JSON.stringify(sampleProduct.categories)}`);
            console.log(`  First category type: ${typeof sampleProduct.categories[0]}`);
            console.log(`  Is ObjectId: ${sampleProduct.categories[0] instanceof ObjectId}`);
        }
        
    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await client.close();
        console.log('\n✅ Connection closed');
    }
}

convertProductCategoriesToObjectIds();