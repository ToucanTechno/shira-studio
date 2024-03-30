import React, {useEffect, useState} from "react";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    Card,
    CardBody,
    Flex,
    Heading,
    Image,
    Wrap,
    Text,
    Button,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper, NumberDecrementStepper
} from "@chakra-ui/react";
import axios from "axios";
import {useParams} from "react-router-dom";
import {IProduct} from "../models/Product";

const Product = () => {
    const [product, setProduct] = useState({} as IProduct);
    const [itemsCount, setItemsCount] = useState(1);
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const params = useParams();

    useEffect(() => {
        axios.get(`http://localhost:3001/api/products/${params.product}`)
            .then(response => {
                // Process the response data
                console.log(response.data);
                setProduct(response.data);
            })
            .catch(error => {
                // Handle any errors
                console.error(error);
            });
    }, []);

    const handleItemsCountChange = (_: string, itemsCount: number) => {
        setItemsCount(itemsCount);
    };

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
                    { product !== null &&
                    <Wrap direction='row'>
                        <Flex w={['100%', '40%']} direction='column'>
                            <Image h={[300, 180, 250, 360, 430]} bg='#00ee70' fit='contain' src={product.image_src} alt={product.description} />
                            <Flex direction='row' mt={1}>
                                <Image flexGrow='1' me={1} fit='contain' bg='#0080ff' h={[100, 70, 100, 140, 180]} src={product.image_src} alt={product.description} />
                                <Image flexGrow='1' me={1} fit='contain' bg='#5080ff' h={[100, 70, 100, 140, 180]} src={product.image_src} alt={product.description} />
                                <Image flexGrow='1' fit='contain' bg='#8080ff' h={[100, 70, 100, 140, 180]} src={product.image_src} alt={product.description} />
                            </Flex>
                        </Flex>
                        <Flex direction='column'>
                            <Heading as='h2' size='lg' noOfLines={1}>{product.name}</Heading>
                            <Text fontSize='md'>{product.price}₪</Text>
                            <Text flexGrow='1' fontSize='md'>{product.description}</Text>
                            <Flex direction='row'>
                                <Button size='lg' me={2} colorScheme='blue'>הוסף לסל</Button>
                                <NumberInput onChange={handleItemsCountChange} allowMouseWheel dir='ltr' size='lg' maxW={20} defaultValue={1} min={0} max={product.stock}>
                                    <NumberInputField />
                                    <NumberInputStepper>
                                        <NumberIncrementStepper />
                                        <NumberDecrementStepper />
                                    </NumberInputStepper>
                                </NumberInput>
                            </Flex>
                        </Flex>
                    </Wrap>
                    }
                    {/* TODO: customer reviews */}
                    {/* TODO: related products */}
                </CardBody>
            </Card>
        </Flex>
    );
}

export default Product;
