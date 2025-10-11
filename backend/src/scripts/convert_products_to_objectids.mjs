import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * This script converts numeric product IDs to ObjectId format
 * 
 * Input: JSON file with numeric _id like {"_id": 4313, ...}
 * Output: JSON file with ObjectId _id like {"_id": {"$oid": "..."}, ...}
 * 
 * Also creates a mapping file for reference conversion in categories
 * 
 * Usage: node convert_products_to_objectids.mjs <input-file> <output-file> <mapping-file>
 */

// Get command line arguments
const args = process.argv.slice(2);
if (args.length < 3) {
  console.error('Usage: node convert_products_to_objectids.mjs <input-file> <output-file> <mapping-file>');
  console.error('Example: node convert_products_to_objectids.mjs ../../tmp/shira-studio.products.json ../../tmp/shira-studio.products.fixed.json ../../tmp/product-id-mapping.json');
  process.exit(1);
}

const inputFile = args[0];
const outputFile = args[1];
const mappingFile = args[2];

// Helper function to convert number to 24-character hex ObjectId
// MongoDB ObjectIds are 12 bytes (24 hex characters)
// We'll use a consistent pattern: pad the number to create a valid ObjectId
function numberToObjectId(num) {
  // Pad the number to 24 characters with leading zeros
  const hexNum = num.toString(16).padStart(24, '0');
  return hexNum;
}

try {
  console.log(`Reading products from: ${inputFile}`);
  
  // Read the input file
  const fileContent = fs.readFileSync(inputFile, 'utf8');
  const products = JSON.parse(fileContent);
  
  console.log(`Found ${products.length} products`);
  
  const idMapping = {};
  
  // Process each product
  const convertedProducts = products.map(product => {
    const converted = { ...product };
    
    // Convert _id if it's a number
    if (typeof converted._id === 'number') {
      const oldId = converted._id;
      const newObjectId = numberToObjectId(oldId);
      
      // Store mapping
      idMapping[oldId] = newObjectId;
      
      // Convert to ObjectId format
      converted._id = { $oid: newObjectId };
      
      console.log(`  ✓ Converted product ${oldId} -> ${newObjectId}`);
    } else if (converted._id && converted._id.$oid) {
      console.log(`  - Product already has ObjectId format: ${converted._id.$oid}`);
    }
    
    // Categories are already in string format (ObjectId strings), keep them as is
    // They will be converted to proper ObjectId references during import
    
    return converted;
  });
  
  // Write the converted products to output file
  const outputPath = path.resolve(outputFile);
  fs.writeFileSync(outputPath, JSON.stringify(convertedProducts, null, 2), 'utf8');
  
  // Write the ID mapping to mapping file
  const mappingPath = path.resolve(mappingFile);
  fs.writeFileSync(mappingPath, JSON.stringify(idMapping, null, 2), 'utf8');
  
  console.log(`\n✅ Conversion complete!`);
  console.log(`   Total products converted: ${Object.keys(idMapping).length}`);
  console.log(`   Output written to: ${outputPath}`);
  console.log(`   Mapping written to: ${mappingPath}`);
  console.log(`\nNext steps:`);
  console.log(`1. Use the mapping file to convert category product references`);
  console.log(`2. Backup your current database`);
  console.log(`3. Drop the products collection: db.products.drop()`);
  console.log(`4. Import the fixed file: mongoimport --db shira-studio --collection products --file "${outputPath}" --jsonArray`);
  
} catch (error) {
  console.error('Error:', error.message);
  process.exit(1);
}