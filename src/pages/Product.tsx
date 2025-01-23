import React, {useCallback, useContext, useEffect, useState} from "react";
import {
    Breadcrumb, BreadcrumbItem, BreadcrumbLink,
    Card, CardBody,
    Flex, Wrap,
    Heading,
    Image,
    Text,
    NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper,
    PopoverTrigger, Popover,
    Portal,
    PopoverContent, PopoverArrow, PopoverCloseButton, PopoverBody, Link, Icon
} from "@chakra-ui/react";
import {useParams} from "react-router";
import {IProduct} from "../models/Product";
import {AuthContext} from "../services/AuthContext";
import {BsCartCheckFill} from "react-icons/bs";
import {CartContext} from "../services/CartContext";

const Product = (props: any) => {
    const [product, setProduct] = useState({} as IProduct);
    const [itemsCount, setItemsCount] = useState(0);
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const params = useParams();
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
                console.error(error);
            }
        );
        console.log(guestData.cartID);
        if (guestData.cartID) {
            getProductCount(params.product).then((productCount) => {
                setItemsCount(productCount);
            });
        }
    }, [params.product, guestData.cartID, api, getProductCount]);

    const handleItemsCountChange = useCallback(async (_: string, newItemsCount: number) => {
        console.log("ItemsCount: ", itemsCount);
        let cartID = localStorage.getItem('cartID');
        setIsAddingToCart(true);
        // TODO: set userId in request to avoid creating double cart
        try {
            console.log('Try creating cart...');
            const newCartID = await tryCreateCart();
            if (newCartID !== null) {
                console.log("Created a new cart in the process of adding to cart:", newCartID);
                cartID = newCartID;
            }
        } catch(error) {
            console.error("Failed creating cart while adding:", error);
            return;
        }

        try {
            await wrapUnlockLock(cartID, async () => {
                const amountToChange = newItemsCount - itemsCount;
                console.log('new items', newItemsCount, 'items', itemsCount, 'amounttochange', amountToChange);
                if (amountToChange !== 0) {
                    return api.put(`/cart/${cartID}`, {productId: params.product, amount: amountToChange})
                        .then(response => {
                            console.log(`op guestData: ${guestData.cartID}`)
                            console.log(response);
                            setItemsCount(newItemsCount);
                            setIsAddingToCart(false);
                        })
                        .catch(error => {
                            console.log(`op error guestData: ${guestData.cartID}`)
                            console.log(error);
                        })
                }
            });
        } catch(error) {
            console.error("Error in wrapUnlockLock: ", error);
        }
    }, [api, itemsCount, params.product, tryCreateCart, wrapUnlockLock, guestData.cartID]);

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
                                <Popover>
                                    <PopoverTrigger>
                                        <NumberInput onChange={handleItemsCountChange}
                                                     allowMouseWheel
                                                     size='lg'
                                                     maxW={20}
                                                     value={itemsCount}
                                                     min={0}
                                                     max={product.stock}>
                                            <NumberInputField />
                                            <NumberInputStepper>
                                                <NumberIncrementStepper />
                                                <NumberDecrementStepper />
                                            </NumberInputStepper>
                                        </NumberInput>
                                    </PopoverTrigger>
                                    <Portal>
                                        <PopoverContent>
                                            <PopoverArrow />
                                            <PopoverCloseButton />
                                            <PopoverBody>
                                                { /* TODO: on hover color = black */ }
                                                <Link href='/cart'><Icon boxSize={8} aria-label='Cart' as={BsCartCheckFill} color='gray' /></Link>
                                                <Text>המוצר: {product.name} x {itemsCount} נוסף לעגלה בהצלחה!</Text>
                                            </PopoverBody>
                                        </PopoverContent>
                                    </Portal>
                                </Popover>
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
