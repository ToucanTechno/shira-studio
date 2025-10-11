import { MongoClient, ObjectId } from 'mongodb';

const MONGODB_URI = 'mongodb://mongo:EpTmcvrPaEpGKjAVeMWaCDaWWbOcZxBR@shortline.proxy.rlwy.net:52833';
const DATABASE_NAME = 'shira-studio';

async function diagnose() {
    const client = new MongoClient(MONGODB_URI);
    
    try {
        await client.connect();
        console.log('Connected to MongoDB\n');
        
        const db = client.db(DATABASE_NAME);
        const categoriesCollection = db.collection('categories');
        const productsCollection = db.collection('products');
        
        // 1. Check how category _id is stored
        console.log('=== Sample Categories ===');
        const categories = await categoriesCollection.find({}).limit(3).toArray();
        categories.forEach(cat => {
            console.log(`ID: ${cat._id}`);
            console.log(`Type: ${typeof cat._id}`);
            console.log(`Is ObjectId: ${cat._id instanceof ObjectId}`);
            console.log(`Name: ${cat.name}`);
            console.log(`Products array length: ${cat.products ? cat.products.length : 0}`);
            console.log('---');
        });
        
        // 2. Check how product references categories
        console.log('\n=== Sample Products ===');
        const products = await productsCollection.find({ categories: { $exists: true, $ne: [] } }).limit(2).toArray();
        products.forEach(prod => {
            console.log(`Product: ${prod.display_name}`);
            console.log(`Categories: ${JSON.stringify(prod.categories)}`);
            console.log(`Category types: ${prod.categories.map(c => typeof c).join(', ')}`);
            console.log('---');
        });
        
        // 3. Try to find category by string ID
        const testId = '68e9540679da1d0f185c323f';
        console.log(`\n=== Testing ID: ${testId} ===`);
        
        const byString = await categoriesCollection.findOne({ _id: testId });
        console.log(`Found by string: ${byString ? 'YES' : 'NO'}`);
        
        const byObjectId = await categoriesCollection.findOne({ _id: new ObjectId(testId) });
        console.log(`Found by ObjectId: ${byObjectId ? 'YES' : 'NO'}`);
        if (byObjectId) {
            console.log(`Category name: ${byObjectId.name}`);
        }
        
        // 4. Count products referencing this category
        const productCount = await productsCollection.countDocuments({ categories: testId });
        console.log(`Products with this category (as string): ${productCount}`);
        
        const productCountObj = await productsCollection.countDocuments({ 
            categories: new ObjectId(testId) 
        });
        console.log(`Products with this category (as ObjectId): ${productCountObj}`);
        
        console.log('\n=== Diagnosis Complete ===');
        process.exit(0);
        
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    } finally {
        await client.close();
    }
}

diagnose();