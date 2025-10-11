import { MongoClient, ObjectId } from 'mongodb';

const MONGODB_URI = 'mongodb://mongo:EpTmcvrPaEpGKjAVeMWaCDaWWbOcZxBR@shortline.proxy.rlwy.net:52833';
const DATABASE_NAME = process.env.DATABASE_NAME || 'shira-studio';

// Category IDs as strings (will be converted to ObjectId)
const validCategoryIdStrings = [
    '68e95406752a48606d7d6416', // fused-glass
    '68e95406dc3f250a575f5dda', // crafts
    '68e95406909d43bcc9afea46', // drawings
    '68e95406ea4dd4b3ba9734a4', // jewelry
    '68e9540676bec99a5d8f4184', // brooches
    '68e9540605cbd157c339a2ff', // earrings
    '68e95406e2030b03a69940e2', // bracelets
    '68e95406d98f96ab4d6b73df', // necklaces
    '68e95406d252e749860ec7ce', // body-jewelry
    '68e95406fedc2e237b37ea90', // tiaras
    '68e95406fac656eb6571ba71', // nature
    '68e954064b6cae7a7290b908', // ethnography
    '68e954062d16b2cc0441018d', // judaica
    '68e95406eb0f28fc0b1b17df', // objects
    '68e95406931560fe35062b55', // urban
    '68e95406373d7f78bf95ef73', // still-paintings
    '68e9540670f91b8ec86a7beb', // portraits
    '68e9540679da1d0f185c323f'  // nature-paintings
];

async function populateCategories() {
    const client = new MongoClient(MONGODB_URI);
    
    try {
        console.log('Connecting to MongoDB...');
        await client.connect();
        console.log('Connected successfully!\n');
        
        const db = client.db(DATABASE_NAME);
        const productsCollection = db.collection('products');
        const categoriesCollection = db.collection('categories');
        
        console.log('=== Starting Category Population ===\n');
        
        let totalProducts = 0;
        let categoriesUpdated = 0;
        let categoriesNotFound = 0;
        
        for (const categoryIdString of validCategoryIdStrings) {
            // Convert string to ObjectId for category lookup
            const categoryObjectId = new ObjectId(categoryIdString);
            
            // Products might reference as string OR ObjectId, check both
            const productsAsString = await productsCollection
                .find({ categories: categoryIdString })
                .project({ _id: 1 })
                .toArray();
            
            const productsAsObjectId = await productsCollection
                .find({ categories: categoryObjectId })
                .project({ _id: 1 })
                .toArray();
            
            // Combine and deduplicate
            const allProducts = [...productsAsString, ...productsAsObjectId];
            const uniqueProductIds = [...new Set(allProducts.map(p => p._id))];
            
            // Update category using ObjectId
            const result = await categoriesCollection.updateOne(
                { _id: categoryObjectId },
                { $set: { products: uniqueProductIds } }
            );
            
            // Get category info
            const category = await categoriesCollection.findOne({ _id: categoryObjectId });
            const categoryName = category ? category.name : 'NOT FOUND';
            
            if (result.matchedCount === 0) {
                console.log(`✗ Category NOT FOUND: ${categoryIdString}`);
                categoriesNotFound++;
            } else {
                console.log(`✓ Category: ${categoryName}`);
                console.log(`  ID: ${categoryIdString}`);
                console.log(`  Products: ${uniqueProductIds.length} (${productsAsString.length} as string, ${productsAsObjectId.length} as ObjectId)`);
                console.log(`  Modified: ${result.modifiedCount > 0 ? 'YES' : 'NO (already up to date)'}\n`);
                
                totalProducts += uniqueProductIds.length;
                if (result.modifiedCount > 0) categoriesUpdated++;
            }
        }
        
        console.log('=== Summary ===');
        console.log(`Total products assigned: ${totalProducts}`);
        console.log(`Categories updated: ${categoriesUpdated}`);
        console.log(`Categories not found: ${categoriesNotFound}`);
        console.log('\n=== Script Complete ===');
        
        process.exit(0);
        
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    } finally {
        await client.close();
    }
}

populateCategories();