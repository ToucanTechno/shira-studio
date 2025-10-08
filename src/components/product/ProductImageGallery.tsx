import React, { useState } from 'react';
import {
    Box,
    Image,
    HStack,
    VStack,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalBody,
    ModalCloseButton,
    Button,
} from '@chakra-ui/react';
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import { IProductImage } from '../../models/Product';

interface ProductImageGalleryProps {
    images: IProductImage[];
    productName: string;
}

export const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({
    images,
    productName,
}) => {
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [showAllThumbnails, setShowAllThumbnails] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure();
    
    // Number of thumbnails to show initially
    const INITIAL_THUMBNAIL_COUNT = 5;

    if (!images || images.length === 0) {
        return (
            <Box
                width="100%"
                height="500px"
                bg="gray.100"
                display="flex"
                alignItems="center"
                justifyContent="center"
                borderRadius="md"
            >
                <Image
                    src="/placeholder-image.jpg"
                    alt={productName}
                    maxH="500px"
                    objectFit="contain"
                />
            </Box>
        );
    }

    const sortedImages = [...images].sort((a, b) => a.order - b.order);
    const selectedImage = sortedImages[selectedImageIndex];

    return (
        <VStack spacing={4} align="stretch">
            {/* Main Image */}
            <Box
                position="relative"
                width="100%"
                height="500px"
                bg="gray.50"
                borderRadius="md"
                overflow="hidden"
                cursor="zoom-in"
                onClick={onOpen}
                _hover={{
                    '& > img': {
                        transform: 'scale(1.05)',
                    },
                }}
            >
                <Image
                    src={selectedImage.url}
                    alt={selectedImage.alt_text || `${productName} - Image ${selectedImageIndex + 1}`}
                    width="100%"
                    height="100%"
                    objectFit="contain"
                    transition="transform 0.3s ease"
                />
            </Box>

            {/* Thumbnail Strip */}
            {sortedImages.length > 1 && (
                <VStack spacing={2} align="stretch">
                    <HStack spacing={2} justify="center" wrap="wrap">
                        {sortedImages
                            .slice(0, showAllThumbnails ? sortedImages.length : INITIAL_THUMBNAIL_COUNT)
                            .map((image, index) => (
                                <Box
                                    key={image.public_id}
                                    width="80px"
                                    height="80px"
                                    borderRadius="md"
                                    overflow="hidden"
                                    cursor="pointer"
                                    border="2px solid"
                                    borderColor={index === selectedImageIndex ? 'blue.500' : 'gray.200'}
                                    transition="all 0.2s"
                                    _hover={{
                                        borderColor: 'blue.400',
                                        transform: 'scale(1.05)',
                                    }}
                                    onClick={() => setSelectedImageIndex(index)}
                                >
                                    <Image
                                        src={image.url}
                                        alt={image.alt_text || `${productName} thumbnail ${index + 1}`}
                                        width="100%"
                                        height="100%"
                                        objectFit="cover"
                                    />
                                </Box>
                            ))}
                    </HStack>
                    
                    {/* Show More/Less Button */}
                    {sortedImages.length > INITIAL_THUMBNAIL_COUNT && (
                        <Box display="flex" justifyContent="center">
                            <Button
                                size="sm"
                                variant="ghost"
                                rightIcon={showAllThumbnails ? <ChevronUpIcon /> : <ChevronDownIcon />}
                                onClick={() => setShowAllThumbnails(!showAllThumbnails)}
                            >
                                {showAllThumbnails
                                    ? 'הצג פחות'
                                    : `הצג עוד (${sortedImages.length - INITIAL_THUMBNAIL_COUNT})`
                                }
                            </Button>
                        </Box>
                    )}
                </VStack>
            )}

            {/* Zoom Modal */}
            <Modal isOpen={isOpen} onClose={onClose} size="6xl" isCentered>
                <ModalOverlay bg="blackAlpha.800" />
                <ModalContent bg="transparent" boxShadow="none" maxW="90vw" maxH="90vh">
                    <ModalCloseButton
                        color="white"
                        bg="blackAlpha.600"
                        _hover={{ bg: 'blackAlpha.800' }}
                        size="lg"
                        top={4}
                        right={4}
                    />
                    <ModalBody p={0} display="flex" alignItems="center" justifyContent="center">
                        <Image
                            src={selectedImage.url}
                            alt={selectedImage.alt_text || `${productName} - Zoomed`}
                            maxW="100%"
                            maxH="90vh"
                            objectFit="contain"
                        />
                    </ModalBody>
                </ModalContent>
            </Modal>
        </VStack>
    );
};