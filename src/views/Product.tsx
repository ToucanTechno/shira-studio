'use client'

import React, {useCallback, useContext, useEffect, useState} from "react";
import {
    Breadcrumb, BreadcrumbItem, BreadcrumbLink,
    Card, CardBody,
    Flex, Wrap,
    Heading,
    Text,
    NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper,
    useToast,
    Tag,
    HStack,
} from "@chakra-ui/react";
import { useParams, useSearchParams } from "next/navigation";
import {IProduct} from "../models/Product";
import {AuthContext} from "../services/AuthContext";
import {CartContext} from "../services/CartContext";
import {logger} from "../utils/logger";
import { ProductImageGallery } from "../components/product/ProductImageGallery";

// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
const Product = (props: any) => {
    const [product, setProduct] = useState({} as IProduct);
    const [itemsCount, setItemsCount] = useState(0);
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const params = useParams();
    const searchParams = useSearchParams();
    const toast = useToast();
    
    // Get the category the user came from (if any)
    const fromCategory = searchParams.get('from');
    // TODO: move all API calls to request context
    const { guestData, api } = useContext(AuthContext)
    const { tryCreateCart, wrapUnlockLock, getProductCount } = useContext(CartContext)

    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        api.get(`/products/${params?.product}`).then((response: any) => {
            // Process the response data
            if (response.data.stock === 0) {
                setItemsCount(0);
            }
            setProduct(response.data);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        }).catch((error: any) => {
                // Handle any errors
                logger.error(error);
            }
        );
        logger.log(guestData.cartID);
        if (guestData.cartID && params?.product) {
            const productId = Array.isArray(params.product) ? params.product[0] : params.product;
            getProductCount(productId).then((productCount) => {
                setItemsCount(productCount);
            });
        }
    }, [params?.product, guestData.cartID, api, getProductCount]);

    const handleItemsCountChange = useCallback(async (_: string, newItemsCount: number) => {
        logger.log("ItemsCount: ", itemsCount, "New count:", newItemsCount);
        let cartID = guestData.cartID;
        setIsAddingToCart(true);

        // TODO: set userId in request to avoid creating double cart
        try {
            logger.log('Try creating cart...');
            const newCartID = await tryCreateCart();
            if (newCartID !== null) {
                logger.log("Created a new cart in the process of adding to cart:", newCartID);
                cartID = newCartID;
            }
        } catch(error) {
            logger.error("Failed creating cart while adding:", error);
            setIsAddingToCart(false);
            toast({
                title: 'שגיאה',
                description: 'נכשל ביצירת עגלת קניות',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        try {
            await wrapUnlockLock(cartID, async () => {
                const amountToChange = newItemsCount - itemsCount;
                logger.log('new items', newItemsCount, 'items', itemsCount, 'amounttochange', amountToChange);
                if (amountToChange !== 0) {
                    // Extract product ID properly from params - ensure it's a string
                    const productId = Array.isArray(params?.product) ? params.product[0] : params?.product;

                    logger.log('=== API REQUEST DEBUG ===');
                    logger.log('Cart ID:', cartID);
                    logger.log('Product ID:', productId);
                    logger.log('Amount to change:', amountToChange);
                    logger.log('========================');

                    // The cart should already be locked by wrapUnlockLock at this point
                    return api.put(`/cart/${cartID}`, {
                        productId: productId,
                        amount: amountToChange
                    })
                        .then(response => {
                            logger.log(`API success response:`, response);
                            setItemsCount(newItemsCount);
                            setIsAddingToCart(false);

                            toast({
                                title: 'נוסף לעגלה!',
                                description: `${product.name} x ${newItemsCount}`,
                                status: 'success',
                                duration: 2000,
                                isClosable: true,
                            });
                        })
                        .catch(error => {
                            logger.error('=== API ERROR DEBUG ===');
                            logger.error('Response data:', error.response?.data);
                            logger.error('Response status:', error.response?.status);
                            logger.error('=======================');

                            setIsAddingToCart(false);

                            let errorMessage = 'נכשל בעדכון העגלה';
                            if (error.response?.data) {
                                if (typeof error.response.data === 'string') {
                                    errorMessage += `: ${error.response.data}`;
                                } else if (error.response.data.message) {
                                    errorMessage += `: ${error.response.data.message}`;
                                }
                            }

                            toast({
                                title: 'שגיאה',
                                description: errorMessage,
                                status: 'error',
                                duration: 5000,
                                isClosable: true,
                            });

                            // Re-throw the error so wrapUnlockLock can handle cleanup
                            throw error;
                        })
                } else {
                    setIsAddingToCart(false);
                    return Promise.resolve(); // Return resolved promise for consistency
                }
            });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch(error: any) {
            logger.error("=== WRAPPER ERROR DEBUG ===");
            logger.error('Full wrapper error:', error);
            logger.error('Wrapper error response:', error.response?.data);
            logger.error('===========================');

            setIsAddingToCart(false);

            let errorMessage = 'נכשל בעדכון העגלה';
            if (error.response?.data) {
                if (typeof error.response.data === 'string') {
                    errorMessage += `: ${error.response.data}`;
                } else if (error.response.data.message) {
                    errorMessage += `: ${error.response.data.message}`;
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
    }, [api, itemsCount, params?.product, tryCreateCart, wrapUnlockLock, guestData.cartID, product.name, toast]);

    // Find the category path to display in breadcrumbs
    const getBreadcrumbCategory = () => {
        if (!product.categories || !Array.isArray(product.categories)) return null;
        
        // If we have a 'from' parameter, find that category
        if (fromCategory) {
            const category = product.categories.find(cat =>
                typeof cat !== 'string' && (cat.name === fromCategory || cat._id === fromCategory)
            );
            if (category && typeof category !== 'string') return category;
        }
        
        // Otherwise, use the first category
        const firstCat = product.categories[0];
        return typeof firstCat === 'string' ? null : firstCat;
    };

    const breadcrumbCategory = getBreadcrumbCategory();

    return (
        <Flex m={4} direction='column'>
            <Flex direction='row' mb={2}>
                <Card width="100%">
                    <CardBody p={2}>
                        <Breadcrumb separator='/' spacing={2}>
                            <BreadcrumbItem>
                                <BreadcrumbLink href='/'>עמוד ראשי</BreadcrumbLink>
                            </BreadcrumbItem>
                            {breadcrumbCategory?.parent && (
                                <BreadcrumbItem>
                                    <BreadcrumbLink href={`/categories/${breadcrumbCategory.parent}`}>
                                        {breadcrumbCategory.parent}
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                            )}
                            {breadcrumbCategory && (
                                <BreadcrumbItem>
                                    <BreadcrumbLink
                                        href={breadcrumbCategory.parent
                                            ? `/categories/${breadcrumbCategory.parent}/${breadcrumbCategory.name}`
                                            : `/categories/${breadcrumbCategory.name}`
                                        }
                                    >
                                        {breadcrumbCategory.text || breadcrumbCategory.name}
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                            )}
                            <BreadcrumbItem isCurrentPage>
                                <Text>{product.name}</Text>
                            </BreadcrumbItem>
                        </Breadcrumb>
                        
                        {/* Show all categories as tags if product belongs to multiple categories */}
                        {product.categories && Array.isArray(product.categories) && product.categories.length > 1 && (
                            <HStack spacing={2} mt={2} wrap="wrap">
                                <Text fontSize="sm" color="gray.600">קטגוריות:</Text>
                                {product.categories.map((category, index) => {
                                    const categoryObj = typeof category === 'string' ? null : category;
                                    if (!categoryObj) return null;
                                    
                                    const categoryUrl = categoryObj.parent
                                        ? `/categories/${categoryObj.parent}/${categoryObj.name}`
                                        : `/categories/${categoryObj.name}`;
                                    
                                    return (
                                        <Tag
                                            key={categoryObj._id || index}
                                            as="a"
                                            href={categoryUrl}
                                            colorScheme="blue"
                                            cursor="pointer"
                                            _hover={{ bg: 'blue.600', color: 'white' }}
                                        >
                                            {categoryObj.text || categoryObj.name}
                                        </Tag>
                                    );
                                })}
                            </HStack>
                        )}
                    </CardBody>
                </Card>
            </Flex>
            <Card>
                <CardBody>
                    <Wrap direction='row' spacing={4}>
                        <Flex w={['100%', '45%']} direction='column'>
                            <ProductImageGallery
                                images={product.images || []}
                                productName={product.name || 'Product'}
                            />
                        </Flex>
                        <Flex direction='column'>
                            <Heading as='h2' size='lg' noOfLines={1}>{product.name}</Heading>
                            <Text fontSize='md'>{product.price}₪</Text>
                            <Text flexGrow='1' fontSize='md'>{product.description}</Text>
                            <Flex direction='row' alignItems='center'>
                                <Heading as='h3' size='md'>עדכון מוצרים בעגלה:&nbsp;</Heading>
                                <NumberInput onChange={handleItemsCountChange}
                                             allowMouseWheel
                                             size='lg'
                                             maxW={20}
                                             value={itemsCount}
                                             min={0}
                                             max={product.stock}
                                             isDisabled={isAddingToCart}>
                                    <NumberInputField />
                                    <NumberInputStepper>
                                        <NumberIncrementStepper />
                                        <NumberDecrementStepper />
                                    </NumberInputStepper>
                                </NumberInput>
                            </Flex>
                        </Flex>
                    </Wrap>
                    {/* TODO: customer reviews */}
                    {/* TODO: related products */}
                </CardBody>
            </Card>
        </Flex>
    );
}

export default Product;