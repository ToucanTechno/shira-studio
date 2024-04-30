import React, {useContext, useEffect, useState} from "react";
import {
    Breadcrumb, BreadcrumbItem, BreadcrumbLink,
    Card, CardBody,
    Flex, Wrap,
    Heading,
    Image,
    Text,
    Button,
    NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper,
    useConst,
    PopoverTrigger, Popover,
    Portal,
    PopoverContent, PopoverArrow, PopoverCloseButton, PopoverBody, Link, Icon
} from "@chakra-ui/react";
import axios, {AxiosInstance} from "axios";
import {useParams} from "react-router-dom";
import {IProduct} from "../models/Product";
import {AuthContext} from "../services/AuthContext";
import {BsCartCheckFill} from "react-icons/bs";

const Product = (props: any) => {
    const [product, setProduct] = useState({} as IProduct);
    const [itemsCount, setItemsCount] = useState(1);
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const params = useParams();
    const api = useConst<AxiosInstance>(() => axios.create({baseURL: 'http://localhost:3001/api'}));
    const { guestData, setGuestData} = useContext(AuthContext)

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
            api.get(`/cart/${guestData.cartID}`).then(response => {
                console.log(response);
            }).catch(error => {
                console.log("error:", error);
            })
        }
    }, [params.product, guestData.cartID, api]);

    const handleItemsCountChange = (_: string, itemsCount: number) => {
        setItemsCount(itemsCount);
    };

    const handleAddToCart = async (event: any) => {
        let cartID = localStorage.getItem("cartID");
        setIsAddingToCart(true);
        // TODO: set userId in request to avoid creating double cart
        if (cartID === null) {
            await api.post(`/cart`,
                {})
                .then(response => {
                    console.log('Done creating cart', response)
                    cartID = response.data['id'];
                    localStorage.setItem("cartID", cartID as string);
                    setGuestData({guestID: guestData.guestID, cartID: cartID});
                })
                .catch(error => {
                    // Handle any errors
                    console.error(error);
                });
        }

        if (cartID === null) {
            console.log('exiting');
            return
        }
        console.log("Adding product", params.product, itemsCount);
        api.put(`/cart/${cartID}`, {productId: params.product, amount: itemsCount})
            .then(response => {
                console.log(response);
                /* TODO: update stock */
                //setItemsCount(product.stock - itemsCount)
                setIsAddingToCart(false);
            })
            .catch(error => {
                console.log(error);
            })
    }

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
                            <Flex direction='row'>
                                <Popover>
                                    <PopoverTrigger>
                                        {/* TODO: make button disabled until popover is closed */}
                                        {/* TODO: make sure stock minus cart value > 0 */}
                                        <Button isDisabled={isAddingToCart || product.stock === 0}
                                                onClick={handleAddToCart}
                                                size='lg'
                                                me={2}
                                                colorScheme='blue'>הוסף לסל</Button>
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
                                <NumberInput onChange={handleItemsCountChange}
                                             allowMouseWheel
                                             size='lg'
                                             maxW={20}
                                             value={itemsCount}
                                             min={0}
                                             max={product.stock}>
                                    {/* TODO: max should me stock minus cart value */}
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
