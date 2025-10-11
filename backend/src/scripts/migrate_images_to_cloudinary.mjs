import { MongoClient } from 'mongodb';

/**
 * This script migrates product image URLs from WordPress to Cloudinary
 * 
 * It updates all product images to use Cloudinary URLs based on their public_id
 * 
 * Usage: node migrate_images_to_cloudinary.mjs
 */

// MongoDB connection details
// const MONGODB_URI = 'mongodb://mongo:EpTmcvrPaEpGKjAVeMWaCDaWWbOcZxBR@shortline.proxy.rlwy.net:52833';
const MONGODB_URI = 'mongodb://localhost:27017';
const DB_NAME = 'shira-studio';
const COLLECTION_NAME = 'products';

// Cloudinary configuration
const CLOUDINARY_CLOUD_NAME = 'deod9mqrf';
const CLOUDINARY_BASE_URL = `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload`;

/**
 * Generate Cloudinary URL from public_id
 * @param {string} publicId - The Cloudinary public_id (e.g., "shira-studio-prod/products/product_4313_0")
 * @returns {string} - The full Cloudinary URL
 */
function generateCloudinaryUrl(publicId) {
  // Cloudinary URLs are in format: https://res.cloudinary.com/{cloud_name}/image/upload/{public_id}.jpg
  // The public_id already contains the full path (e.g., "shira-studio-prod/products/product_4313_0")
  // We just append .jpg extension
  return `${CLOUDINARY_BASE_URL}/${publicId}.jpg`;
}

/**
 * Main migration function
 */
async function migrateImages() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    console.log('Connecting to MongoDB...');
    await client.connect();
    console.log('✓ Connected to MongoDB');
    
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);
    
    // Find all products with images
    const products = await collection.find({ 
      images: { $exists: true, $ne: [] } 
    }).toArray();
    
    console.log(`\nFound ${products.length} products with images`);
    
    let updatedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;
    
    for (const product of products) {
      try {
        const updatedImages = product.images.map(image => {
          // Check if the URL is still pointing to WordPress
          if (image.url && image.url.includes('shira.studio/wp-content')) {
            if (image.public_id) {
              // Generate new Cloudinary URL
              const newUrl = generateCloudinaryUrl(image.public_id);
              console.log(`  ✓ Product ${product._id}: ${image.url} -> ${newUrl}`);
              return { ...image, url: newUrl };
            } else {
              console.log(`  ⚠ Product ${product._id}: Image has no public_id, skipping`);
              return image;
            }
          } else if (image.url && image.url.includes('cloudinary.com')) {
            console.log(`  - Product ${product._id}: Already using Cloudinary URL`);
            return image;
          } else {
            console.log(`  ? Product ${product._id}: Unknown URL format: ${image.url}`);
            return image;
          }
        });
        
        // Update the product with new image URLs
        const result = await collection.updateOne(
          { _id: product._id },
          { $set: { images: updatedImages } }
        );
        
        if (result.modifiedCount > 0) {
          updatedCount++;
        } else {
          skippedCount++;
        }
        
      } catch (error) {
        console.error(`  ✗ Error updating product ${product._id}:`, error.message);
        errorCount++;
      }
    }
    
    console.log('\n' + '='.repeat(60));
    console.log('Migration Summary:');
    console.log('='.repeat(60));
    console.log(`Total products processed: ${products.length}`);
    console.log(`Products updated: ${updatedCount}`);
    console.log(`Products skipped: ${skippedCount}`);
    console.log(`Errors: ${errorCount}`);
    console.log('='.repeat(60));
    
    if (updatedCount > 0) {
      console.log('\n✅ Migration completed successfully!');
      console.log('\nNext steps:');
      console.log('1. Verify the images are loading correctly on your site');
      console.log('2. Check a few products to ensure URLs are correct');
      console.log('3. Clear any CDN or browser cache if needed');
    } else {
      console.log('\n⚠ No products were updated. All images may already be using Cloudinary URLs.');
    }
    
  } catch (error) {
    console.error('\n✗ Migration failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  } finally {
    await client.close();
    console.log('\n✓ MongoDB connection closed');
  }
}

// Run the migration
console.log('Starting image URL migration to Cloudinary...\n');
migrateImages();