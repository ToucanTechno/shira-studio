import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env['CLOUDINARY_CLOUD_NAME'],
    api_key: process.env['CLOUDINARY_API_KEY'],
    api_secret: process.env['CLOUDINARY_API_SECRET'],
    secure: true
});

// Verify configuration
const verifyCloudinaryConfig = () => {
    const { cloud_name, api_key, api_secret } = cloudinary.config();
    
    if (!cloud_name || !api_key || !api_secret) {
        console.error('❌ Cloudinary configuration is incomplete!');
        console.error('Missing:', {
            cloud_name: !cloud_name,
            api_key: !api_key,
            api_secret: !api_secret
        });
        return false;
    }
    
    console.log('✅ Cloudinary configured successfully:', cloud_name);
    return true;
};

// Verify on module load
verifyCloudinaryConfig();

export default cloudinary;
export { verifyCloudinaryConfig };