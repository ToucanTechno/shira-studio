import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';

// Load environment variables
dotenv.config();

console.log('\n=== Cloudinary Configuration Verification ===\n');

// Check environment variables
console.log('Environment Variables:');
console.log('CLOUDINARY_CLOUD_NAME:', process.env['CLOUDINARY_CLOUD_NAME'] || '❌ NOT SET');
console.log('CLOUDINARY_API_KEY:', process.env['CLOUDINARY_API_KEY'] || '❌ NOT SET');
console.log('CLOUDINARY_API_SECRET:', process.env['CLOUDINARY_API_SECRET'] ? '✅ SET (hidden)' : '❌ NOT SET');

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env['CLOUDINARY_CLOUD_NAME'],
    api_key: process.env['CLOUDINARY_API_KEY'],
    api_secret: process.env['CLOUDINARY_API_SECRET'],
    secure: true
});

// Verify configuration
const config = cloudinary.config();
console.log('\nCloudinary SDK Configuration:');
console.log('cloud_name:', config.cloud_name || '❌ NOT SET');
console.log('api_key:', config.api_key || '❌ NOT SET');
console.log('api_secret:', config.api_secret ? '✅ SET (hidden)' : '❌ NOT SET');

if (config.cloud_name && config.api_key && config.api_secret) {
    console.log('\n✅ Cloudinary is properly configured!');
} else {
    console.log('\n❌ Cloudinary configuration is incomplete!');
    process.exit(1);
}