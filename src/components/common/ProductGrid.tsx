'use client'

import React, {useCallback, useContext, useEffect, useState} from "react";
import Link from "next/link";
import {Link as ChakraLink} from "@chakra-ui/react";
import {Box, Button, Flex, Image, SimpleGrid, useToast} from "@chakra-ui/react";
import {useInfiniteScroll} from "../../utils/useInfiniteScroll";
import {Loader} from "../infinite_scroll/Loader";
import {IProduct} from "../../models/Product";
import {AuthContext} from "../../services/AuthContext";
import {CartContext} from "../../services/CartContext";
import {logger} from "../../utils/logger";

interface ProductGridProps {
    categoryName: string;
    initialProducts?: IProduct[];
}

export const ProductGrid = ({ categoryName, initialProducts = [] }: ProductGridProps) => {
    const {
        isLoading,
        loadMoreCallback,
        getInitialProducts,
        dynamicProducts,
        isLastPage
    } = useInfiniteScroll(initialProducts, categoryName);

    const { guestData, api } = useContext(AuthContext);
    const { tryCreateCart } = useContext(CartContext);
    const toast = useToast();
    const [addingToCart, setAddingToCart] = useState<Record<string, boolean>>({});

    useEffect(() => {
        // Only fetch initial products if we don't have SSR products
        if (initialProducts.length === 0) {
            getInitialProducts();
        }
    }, [getInitialProducts, initialProducts.length]);

    const handleAddToCart = useCallback(async (product: IProduct) => {
        const productId = product._id;
        
        // Guard against missing product ID
        if (!productId) {
            logger.error("Product missing _id:", product);
            toast({
                title: 'שגיאה',
                description: 'מזהה מוצר חסר',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            return;
        }
        
        // Prevent multiple simultaneous additions
        if (addingToCart[productId]) {
            return;
        }

        setAddingToCart(prev => ({ ...prev, [productId]: true }));

        let cartID = guestData.cartID;

        // Try to create cart if it doesn't exist
        try {
            logger.log('Try creating cart...');
            const newCartID = await tryCreateCart();
            if (newCartID !== null) {
                logger.log("Created a new cart in the process of adding to cart:", newCartID);
                cartID = newCartID;
            }
        } catch(error) {
            logger.error("Failed creating cart while adding:", error);
            setAddingToCart(prev => ({ ...prev, [productId]: false }));
            toast({
                title: 'שגיאה',
                description: 'נכשל ביצירת עגלת קניות',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        // Add 1 item to cart (backend auto-unlocks if needed)
        try {
            logger.log('Adding product to cart:', productId);
            
            await api.put(`/cart/${cartID}`, {
                productId: productId,
                amount: 1
            });
            
            logger.log(`Successfully added product to cart`);
            setAddingToCart(prev => ({ ...prev, [productId]: false }));

            toast({
                title: 'נוסף לעגלה!',
                description: `${product.name}`,
                status: 'success',
                duration: 2000,
                isClosable: true,
            });
        } catch(error: unknown) {
            const axiosError = error as { response?: { data?: string | { message?: string } } };
            logger.error('API ERROR:', axiosError.response?.data);
            setAddingToCart(prev => ({ ...prev, [productId]: false }));

            let errorMessage = 'נכשל בעדכון העגלה';
            if (axiosError.response?.data) {
                if (typeof axiosError.response.data === 'string') {
                    errorMessage += `: ${axiosError.response.data}`;
                } else if (axiosError.response.data.message) {
                    errorMessage += `: ${axiosError.response.data.message}`;
                }
            }

            toast({
                title: 'שגיאה',
                description: errorMessage,
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    }, [api, guestData.cartID, tryCreateCart, toast, addingToCart]);

    if (dynamicProducts.length === 0 && !isLoading) {
        return null;
    }

    return (
        <Box>
            <SimpleGrid columns={[1, 2, 3, 4, 5]} spacing={4} className="gallery">
                {dynamicProducts.map((product) => {
                    // Get the first image from the images array, or use a placeholder
                    const firstImage = product.images && product.images.length > 0
                        ? product.images.sort((a, b) => a.order - b.order)[0]
                        : null;
                    
                    return (
                        <Flex direction='column' justifyContent='flex-start' alignItems='center' key={product._id}>
                            <ChakraLink as={Link} href={"/product/" + product._id} width="100%">
                                <Image
                                    objectFit='contain'
                                    w='100%'
                                    height={['250px', '220px', '200px', '180px', '160px']}
                                    src={firstImage?.url || '/images/placeholder-image.svg'}
                                    alt={firstImage?.alt_text || product.name}
                                />
                                {product.description}
                            </ChakraLink>
                            <Box className="price">{product.price}</Box>
                            <Button
                                className="cart-button"
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleAddToCart(product);
                                }}
                                isLoading={product._id ? addingToCart[product._id] : false}
                                isDisabled={(product._id && addingToCart[product._id]) || product.stock === 0}
                            >
                                הוסף לסל
                            </Button>
                        </Flex>
                    );
                })}
            </SimpleGrid>

            <Loader
                isLoading={isLoading}
                isLastPage={isLastPage}
                loadMoreCallback={loadMoreCallback}
            />
        </Box>
    );
};