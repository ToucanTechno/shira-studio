import React, {useState} from "react";
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

const Product = () => {
    const product = {href: 'hello.jpg', description: 'abc description'};
    const [itemsCount, setItemsCount] = useState(1);
    const [isAddingToCart, setIsAddingToCart] = useState(false);
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
                                <BreadcrumbLink href='#'>Home</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbItem>
                                <BreadcrumbLink href='#'>Category</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbItem>
                                <BreadcrumbLink href='#'>SubCategory</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbItem>
                                <BreadcrumbLink href='#'>Product</BreadcrumbLink>
                            </BreadcrumbItem>
                        </Breadcrumb>
                    </CardBody>
                </Card>
            </Flex>
            <Card>
                <CardBody>
                    <Wrap direction='row'>
                        <Flex w={['100%', '40%']} direction='column'>
                            <Image h={[300, 180, 250, 360, 430]} bg='#00ee70' fit='contain' src={product.href} alt={product.description} />
                            <Flex direction='row' mt={1}>
                                <Image flexGrow='1' me={1} fit='contain' bg='#0080ff' h={[100, 70, 100, 140, 180]} src={product.href} alt={product.description} />
                                <Image flexGrow='1' me={1} fit='contain' bg='#5080ff' h={[100, 70, 100, 140, 180]} src={product.href} alt={product.description} />
                                <Image flexGrow='1' fit='contain' bg='#8080ff' h={[100, 70, 100, 140, 180]} src={product.href} alt={product.description} />
                            </Flex>
                        </Flex>
                        <Flex direction='column'>
                            <Heading as='h2' size='lg' noOfLines={1}>Product title</Heading>
                            <Text fontSize='md'>600₪</Text>
                            <Text flexGrow='1' fontSize='md'>{product.description}</Text>
                            <Flex direction='row'>
                                <Button size='lg' me={2} colorScheme='blue'>הוסף לסל</Button>
                                <NumberInput onChange={handleItemsCountChange} allowMouseWheel dir='ltr' size='lg' maxW={20} defaultValue={1} min={0} max={99}>
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
