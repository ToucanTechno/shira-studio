import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';
import { logger } from '../utils/logger';

export interface ProductImage {
    url: string;
    public_id: string;
    order: number;
    alt_text?: string;
}

export interface UploadResult {
    success: boolean;
    image?: ProductImage;
    error?: string;
}

class ImageUploadService {
    private readonly FOLDER: string;
    private readonly MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    private readonly ALLOWED_FORMATS = ['jpg', 'jpeg', 'png', 'webp'];

    constructor() {
        // Set folder based on environment to separate test and production images
        const env = process.env['NODE_ENV'] || 'development';
        const folderPrefix = env === 'production' ? 'shira-studio-prod' : 'shira-studio-test';
        this.FOLDER = `${folderPrefix}/products`;
        
        logger.log(`📁 Cloudinary upload folder set to: ${this.FOLDER} (environment: ${env})`);
    }

    /**
     * Upload a single image to Cloudinary
     */
    async uploadImage(
        fileBuffer: Buffer,
        filename: string,
        order: number = 0
    ): Promise<UploadResult> {
        try {
            // Validate file size
            if (fileBuffer.length > this.MAX_FILE_SIZE) {
                return {
                    success: false,
                    error: `File size exceeds maximum allowed size of ${this.MAX_FILE_SIZE / 1024 / 1024}MB`
                };
            }

            // Upload to Cloudinary
            const result: UploadApiResponse = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    {
                        folder: this.FOLDER,
                        resource_type: 'image',
                        allowed_formats: this.ALLOWED_FORMATS,
                        transformation: [
                            { width: 1200, height: 1200, crop: 'limit', quality: 'auto:good' }
                        ],
                        format: 'jpg' // Convert all to JPG for consistency
                    },
                    (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
                        if (error) reject(error);
                        else if (result) resolve(result);
                        else reject(new Error('Upload failed with no result'));
                    }
                );

                uploadStream.end(fileBuffer);
            });

            return {
                success: true,
                image: {
                    url: result.secure_url,
                    public_id: result.public_id,
                    order: order,
                    alt_text: filename
                }
            };
        } catch (error: any) {
            logger.error('Error uploading image to Cloudinary:', error);
            return {
                success: false,
                error: error.message || 'Failed to upload image'
            };
        }
    }

    /**
     * Upload multiple images to Cloudinary
     */
    async uploadMultipleImages(
        files: Array<{ buffer: Buffer; filename: string }>
    ): Promise<{ images: ProductImage[]; errors: string[] }> {
        const images: ProductImage[] = [];
        const errors: string[] = [];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (!file) continue;
            
            const result = await this.uploadImage(file.buffer, file.filename, i);

            if (result.success && result.image) {
                images.push(result.image);
            } else {
                errors.push(`${file.filename}: ${result.error}`);
            }
        }

        return { images, errors };
    }

    /**
     * Delete an image from Cloudinary
     */
    async deleteImage(publicId: string): Promise<{ success: boolean; error?: string }> {
        try {
            const result = await cloudinary.uploader.destroy(publicId);
            
            if (result.result === 'ok' || result.result === 'not found') {
                return { success: true };
            }

            return {
                success: false,
                error: `Failed to delete image: ${result.result}`
            };
        } catch (error: any) {
            logger.error('Error deleting image from Cloudinary:', error);
            return {
                success: false,
                error: error.message || 'Failed to delete image'
            };
        }
    }

    /**
     * Delete multiple images from Cloudinary
     */
    async deleteMultipleImages(publicIds: string[]): Promise<{ success: boolean; errors: string[] }> {
        const errors: string[] = [];

        for (const publicId of publicIds) {
            const result = await this.deleteImage(publicId);
            if (!result.success) {
                errors.push(`${publicId}: ${result.error}`);
            }
        }

        return {
            success: errors.length === 0,
            errors
        };
    }

    /**
     * Generate optimized image URLs with transformations
     */
    getOptimizedUrl(publicId: string, transformation: 'thumbnail' | 'main' | 'zoom'): string {
        const transformations = {
            thumbnail: 'c_fill,w_150,h_150,q_auto,f_auto',
            main: 'c_fit,w_800,h_800,q_90,f_auto',
            zoom: 'c_fit,w_1200,h_1200,q_95,f_auto'
        };

        return cloudinary.url(publicId, {
            transformation: transformations[transformation],
            secure: true
        });
    }

    /**
     * Validate image file
     */
    validateImageFile(mimetype: string, size: number): { valid: boolean; error?: string } {
        // Check file type
        const fileExtension = mimetype.split('/')[1];
        if (!fileExtension || !this.ALLOWED_FORMATS.includes(fileExtension)) {
            return {
                valid: false,
                error: `Invalid file format. Allowed formats: ${this.ALLOWED_FORMATS.join(', ')}`
            };
        }

        // Check file size
        if (size > this.MAX_FILE_SIZE) {
            return {
                valid: false,
                error: `File size exceeds maximum allowed size of ${this.MAX_FILE_SIZE / 1024 / 1024}MB`
            };
        }

        return { valid: true };
    }
}

export default new ImageUploadService();