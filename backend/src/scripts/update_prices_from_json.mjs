import { MongoClient, ObjectId } from 'mongodb';
import { readFileSync } from 'fs';

const MONGODB_URI = 'mongodb://localhost:2701src/views/Cart.tsx7';
const DB_NAME = 'shira-studio'; // Update if different
const JSON_FILE_PATH = '/Users/matanliram/tmp/shira-studio.products-fixed.json';

async function updatePrices() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    console.log('Connecting to MongoDB...');
    await client.connect();
    console.log('Connected successfully');
    
    const db = client.db(DB_NAME);
    const productsCollection = db.collection('products');
    
    // Read the JSON file
    console.log(`Reading JSON file from ${JSON_FILE_PATH}...`);
    const fileContent = readFileSync(JSON_FILE_PATH, 'utf-8');
    const products = JSON.parse(fileContent);
    console.log(`Found ${products.length} products in JSON file`);
    
    let updatedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;
    
    for (const product of products) {
      try {
        // Get the product ID
        const productId = product._id?.$oid || product._id;
        
        if (!productId) {
          console.log(`Skipping product without ID: ${product.display_name || 'Unknown'}`);
          skippedCount++;
          continue;
        }
        
        // Get the price from the JSON
        let price = product.pricing?.price;
        
        // Skip if price is null, undefined, or empty string
        if (price === null || price === undefined || price === '') {
          console.log(`Skipping product ${productId} - no valid price`);
          skippedCount++;
          continue;
        }
        
        // Convert string prices to integers
        if (typeof price === 'string') {
          price = parseInt(price, 10);
          if (isNaN(price)) {
            console.log(`Skipping product ${productId} - invalid price format: ${product.pricing?.price}`);
            skippedCount++;
            continue;
          }
        }
        
        // Ensure price is a number
        if (typeof price !== 'number') {
          console.log(`Skipping product ${productId} - price is not a number: ${price}`);
          skippedCount++;
          continue;
        }
        
        // Update the product in MongoDB
        const result = await productsCollection.updateOne(
          { _id: new ObjectId(productId) },
          { 
            $set: { 
              'pricing.price': price,
              modified_at: new Date().toISOString()
            } 
          }
        );
        
        if (result.matchedCount > 0) {
          console.log(`✓ Updated product ${productId} (${product.display_name}) - price: ${price}`);
          updatedCount++;
        } else {
          console.log(`✗ Product ${productId} not found in database`);
          errorCount++;
        }
        
      } catch (error) {
        console.error(`Error updating product ${product._id?.$oid || product._id}:`, error.message);
        errorCount++;
      }
    }
    
    console.log('\n=== Update Summary ===');
    console.log(`Total products in JSON: ${products.length}`);
    console.log(`Successfully updated: ${updatedCount}`);
    console.log(`Skipped (no valid price): ${skippedCount}`);
    console.log(`Errors: ${errorCount}`);
    
  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  } finally {
    await client.close();
    console.log('\nMongoDB connection closed');
  }
}

// Run the update
updatePrices().catch(console.error);