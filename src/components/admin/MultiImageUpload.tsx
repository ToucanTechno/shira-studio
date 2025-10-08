import React, { useState, useCallback, useEffect } from 'react';
import {
    Box,
    Image,
    SimpleGrid,
    Text,
    VStack,
    HStack,
    IconButton,
    useToast,
    Progress,
} from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import { IProductImage } from '../../models/Product';
import { API_URL } from '../../utils/apiConfig';

interface MultiImageUploadProps {
    productId?: string;
    existingImages?: IProductImage[];
    onImagesChange?: (images: IProductImage[]) => void;
    onFilesSelected?: (files: File[]) => void;
    maxImages?: number;
}

interface UploadingFile {
    file: File;
    preview: string;
    progress: number;
    error?: string;
}

export const MultiImageUpload: React.FC<MultiImageUploadProps> = ({
    productId,
    existingImages = [],
    onImagesChange,
    onFilesSelected,
    maxImages = 10,
}) => {
    const [images, setImages] = useState<IProductImage[]>(existingImages);
    const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const toast = useToast();

    // Sync with existingImages prop when it changes
    useEffect(() => {
        setImages(existingImages);
    }, [existingImages]);

    const uploadFiles = useCallback(async (files: File[]) => {
        if (!productId) {
            console.error('Cannot upload: productId is required');
            return;
        }

        const formData = new FormData();
        files.forEach((file) => {
            formData.append('images', file);
        });

        try {
            const response = await fetch(
                `${API_URL}/products/${productId}/images`,
                {
                    method: 'POST',
                    body: formData,
                }
            );

            if (!response.ok) {
                throw new Error('Upload failed');
            }

            const data = await response.json();
            const newImages = data.images as IProductImage[];

            const updatedImages = [...images, ...newImages];
            setImages(updatedImages);
            onImagesChange?.(updatedImages);

            setUploadingFiles([]);

            toast({
                title: 'Upload successful',
                description: `${files.length} image(s) uploaded`,
                status: 'success',
                duration: 3000,
            });
        } catch (error) {
            console.error('Upload error:', error);
            toast({
                title: 'Upload failed',
                description: 'Failed to upload images. Please try again.',
                status: 'error',
                duration: 5000,
            });
            setUploadingFiles([]);
        }
    }, [productId, images, onImagesChange, toast]);

    const handleFileSelect = useCallback(
        (files: FileList | null) => {
            if (!files) return;

            const fileArray = Array.from(files);
            const remainingSlots = maxImages - images.length - uploadingFiles.length;

            if (fileArray.length > remainingSlots) {
                toast({
                    title: 'Too many files',
                    description: `You can only upload ${remainingSlots} more image(s)`,
                    status: 'warning',
                    duration: 3000,
                });
                return;
            }

            // Validate file types
            const validFiles = fileArray.filter((file) => {
                if (!file.type.startsWith('image/')) {
                    toast({
                        title: 'Invalid file type',
                        description: `${file.name} is not an image`,
                        status: 'error',
                        duration: 3000,
                    });
                    return false;
                }
                if (file.size > 5 * 1024 * 1024) {
                    toast({
                        title: 'File too large',
                        description: `${file.name} exceeds 5MB`,
                        status: 'error',
                        duration: 3000,
                    });
                    return false;
                }
                return true;
            });

            // Create preview URLs and add to uploading state
            const newUploadingFiles: UploadingFile[] = validFiles.map((file) => ({
                file,
                preview: URL.createObjectURL(file),
                progress: 0,
            }));

            setUploadingFiles((prev) => [...prev, ...newUploadingFiles]);

            // If productId exists, upload immediately. Otherwise, notify parent and keep previews
            if (productId) {
                uploadFiles(validFiles);
            } else {
                onFilesSelected?.(validFiles);
                // Keep uploading state to show previews for new products
                // Don't clear it - let the parent component handle the upload after product creation
            }
        },
        [images.length, uploadingFiles.length, maxImages, toast, productId, onFilesSelected, uploadFiles]
    );

    const handleDelete = async (publicId: string) => {
        if (!productId) {
            console.error('Cannot delete: productId is required');
            return;
        }

        try {
            // Extract just the image ID from the full public_id path
            // e.g., "shira-studio/products/abc123" -> "abc123"
            const imageId = publicId.split('/').pop() || publicId;
            const deleteUrl = `${API_URL}/products/${productId}/images/${imageId}`;
            console.log('Deleting image:', { productId, publicId, imageId, deleteUrl });
            
            const response = await fetch(deleteUrl, {
                method: 'DELETE',
            });

            console.log('Delete response:', { status: response.status, ok: response.ok });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Delete failed with response:', errorText);
                throw new Error('Delete failed');
            }

            const updatedImages = images.filter((img) => img.public_id !== publicId);
            setImages(updatedImages);
            onImagesChange?.(updatedImages);

            toast({
                title: 'Image deleted',
                status: 'success',
                duration: 2000,
            });
        } catch (error) {
            console.error('Delete error:', error);
            toast({
                title: 'Delete failed',
                description: 'Failed to delete image. Please try again.',
                status: 'error',
                duration: 5000,
            });
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        handleFileSelect(e.dataTransfer.files);
    };

    return (
        <VStack spacing={4} align="stretch">
            {/* Upload Area */}
            <Box
                border="2px dashed"
                borderColor={isDragging ? 'blue.500' : 'gray.300'}
                borderRadius="md"
                p={8}
                textAlign="center"
                bg={isDragging ? 'blue.50' : 'gray.50'}
                cursor="pointer"
                transition="all 0.2s"
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => document.getElementById('file-input')?.click()}
            >
                <input
                    id="file-input"
                    type="file"
                    multiple
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={(e) => handleFileSelect(e.target.files)}
                />
                <Text fontSize="lg" mb={2}>
                    Drag & drop images here, or click to select
                </Text>
                <Text fontSize="sm" color="gray.600">
                    Maximum {maxImages} images, up to 5MB each
                </Text>
                <Text fontSize="sm" color="gray.600">
                    {images.length + uploadingFiles.length} / {maxImages} images {productId ? 'uploaded' : 'selected'}
                </Text>
            </Box>

            {/* Uploading/Selected Files */}
            {uploadingFiles.length > 0 && (
                <VStack spacing={2} align="stretch">
                    <Text fontWeight="bold">{productId ? 'Uploading...' : 'Selected images (will upload when product is created)'}</Text>
                    {uploadingFiles.map((file, index) => (
                        <Box key={index} p={2} border="1px" borderColor="gray.200" borderRadius="md">
                            <HStack>
                                <Image
                                    src={file.preview}
                                    alt={productId ? "Uploading" : "Selected"}
                                    boxSize="50px"
                                    objectFit="cover"
                                    borderRadius="md"
                                />
                                <VStack flex={1} align="stretch" spacing={1}>
                                    <Text fontSize="sm" noOfLines={1}>
                                        {file.file.name}
                                    </Text>
                                    {productId && (
                                        <Progress
                                            value={file.progress}
                                            size="sm"
                                            colorScheme="blue"
                                            isIndeterminate
                                        />
                                    )}
                                </VStack>
                            </HStack>
                        </Box>
                    ))}
                </VStack>
            )}

            {/* Existing Images */}
            {images.length > 0 && (
                <SimpleGrid columns={[2, 3, 4]} spacing={4}>
                    {images
                        .sort((a, b) => a.order - b.order)
                        .map((image, index) => (
                            <Box
                                key={image.public_id}
                                position="relative"
                                border="1px"
                                borderColor="gray.200"
                                borderRadius="md"
                                overflow="hidden"
                                _hover={{ borderColor: 'blue.500' }}
                            >
                                <Image
                                    src={image.url}
                                    alt={image.alt_text || `Product image ${index + 1}`}
                                    width="100%"
                                    height="150px"
                                    objectFit="cover"
                                />
                                <HStack
                                    position="absolute"
                                    top={2}
                                    right={2}
                                    spacing={1}
                                >
                                    <IconButton
                                        aria-label="Delete image"
                                        icon={<DeleteIcon />}
                                        size="sm"
                                        colorScheme="red"
                                        onClick={() => handleDelete(image.public_id)}
                                    />
                                </HStack>
                                <Box
                                    position="absolute"
                                    bottom={0}
                                    left={0}
                                    right={0}
                                    bg="blackAlpha.700"
                                    color="white"
                                    p={1}
                                    fontSize="xs"
                                    textAlign="center"
                                >
                                    Image {index + 1}
                                </Box>
                            </Box>
                        ))}
                </SimpleGrid>
            )}

            {images.length === 0 && uploadingFiles.length === 0 && (
                <Text color="gray.500" textAlign="center">
                    No images uploaded yet
                </Text>
            )}
        </VStack>
    );
};