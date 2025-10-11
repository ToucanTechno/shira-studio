import { MongoClient, ObjectId } from 'mongodb';

const MONGODB_URI = 'mongodb://mongo:EpTmcvrPaEpGKjAVeMWaCDaWWbOcZxBR@shortline.proxy.rlwy.net:52833';
const DATABASE_NAME = process.env.DATABASE_NAME || 'shira-studio';

async function findInvalidCategories() {
    const client = new MongoClient(MONGODB_URI);
    
    try {
        await client.connect();
        console.log('Connected to MongoDB\n');
        
        const db = client.db(DATABASE_NAME);
        const productsCollection = db.collection('products');
        const categoriesCollection = db.collection('categories');
        
        // Get all valid category IDs
        const validCategories = await categoriesCollection.find({}).toArray();
        const validIdStrings = validCategories.map(c => c._id.toString());
        const validIdObjects = validCategories.map(c => c._id);
        
        console.log(`Found ${validCategories.length} valid categories\n`);
        console.log('=== Checking Products ===\n');
        
        // Get all products with categories
        const products = await productsCollection.find({
            categories: { $exists: true, $ne: [] }
        }).toArray();
        
        const productsWithInvalid = [];
        
        for (const product of products) {
            const invalidCats = product.categories.filter(catId => {
                const catIdString = catId.toString();
                return !validIdStrings.includes(catIdString);
            });
            
            if (invalidCats.length > 0) {
                productsWithInvalid.push({
                    id: product._id,
                    name: product.display_name,
                    allCategories: product.categories,
                    invalidCategories: invalidCats
                });
            }
        }
        
        console.log(`Total products checked: ${products.length}`);
        console.log(`Products with invalid categories: ${productsWithInvalid.length}\n`);
        
        if (productsWithInvalid.length > 0) {
            console.log('=== Invalid Category References ===\n');
            productsWithInvalid.forEach(item => {
                console.log(`Product: ${item.name} (ID: ${item.id})`);
                console.log(`  Invalid categories: ${item.invalidCategories.join(', ')}`);
                console.log('');
            });
        } else {
            console.log('✓ All products have valid category references!');
        }
        
        process.exit(0);
        
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    } finally {
        await client.close();
    }
}

findInvalidCategories();