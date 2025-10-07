'use client'

import React, {useCallback, useContext, useEffect, useState} from "react";
import {
    Breadcrumb, BreadcrumbItem, BreadcrumbLink,
    Card, CardBody,
    Flex, Wrap,
    Heading,
    Image,
    Text,
    NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper,
    useToast
} from "@chakra-ui/react";
import { useParams } from "next/navigation";
import {IProduct} from "../models/Product";
import {AuthContext} from "../services/AuthContext";
import {CartContext} from "../services/CartContext";
import {logger} from "../utils/logger";

const Product = (props: any) => {
    const [product, setProduct] = useState({} as IProduct);
    const [itemsCount, setItemsCount] = useState(0);
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const [lastAddedCount, setLastAddedCount] = useState(0);
    const params = useParams();
    const toast = useToast();
    // TODO: move all API calls to request context
    const { guestData, api } = useContext(AuthContext)
    const { tryCreateCart, wrapUnlockLock, getProductCount } = useContext(CartContext)

    useEffect(() => {
        api.get(`/products/${params.product}`).then((response: any) => {
            // Process the response data
            if (response.data.stock === 0) {
                setItemsCount(0);
            }
            setProduct(response.data);
        }).catch((error: any) => {
                // Handle any errors
                logger.error(error);
            }
        );
        logger.log(guestData.cartID);
        if (guestData.cartID) {
            getProductCount(params.product).then((productCount) => {
                setItemsCount(productCount);
            });
        }
    }, [params.product, guestData.cartID, api, getProductCount]);

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
                    const productId = Array.isArray(params.product) ? params.product[0] : params.product;

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
                            setLastAddedCount(newItemsCount);
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
    }, [api, itemsCount, params.product, tryCreateCart, wrapUnlockLock, guestData.cartID, product.name, toast]);

    return (
        <Flex m={4} direction='column'>
            <Flex direction='row' mb={2}>
                <Card align='center'>
                    <CardBody p={2}>
                        <Breadcrumb separator='/'>
                            <BreadcrumbItem>
                                <BreadcrumbLink href='/'>עמוד ראשי</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbItem>
                                <BreadcrumbLink href='#'>Category</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbItem>
                                <BreadcrumbLink href='#'>SubCategory</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbItem>
                                <BreadcrumbLink href={product._id}>{product.name}</BreadcrumbLink>
                            </BreadcrumbItem>
                        </Breadcrumb>
                    </CardBody>
                </Card>
            </Flex>
            <Card>
                <CardBody>
                    <Wrap direction='row'>
                        <Flex w={['100%', '45%']} direction='column'>
                            <Image h={[300, 180, 250, 360, 430]} bg='#00ee70' fit='contain' src={product.image_src} alt={product.description} />
                            <Flex direction='row' mt={1} justifyContent='stretch'>
                                <Image flexGrow='1' me={1} fit='contain' bg='#0080ff' src={product.image_src} alt={product.description} />
                                <Image flexGrow='1' me={1} fit='contain' bg='#5080ff'  src={product.image_src} alt={product.description} />
                                <Image flexGrow='1' fit='contain' bg='#8080ff'  src={product.image_src} alt={product.description} />
                            </Flex>
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