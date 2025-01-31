import React, {useEffect, useState} from "react";
import {Link as ReactRouterLink} from "react-router";
import {Link as ChakraLink} from "@chakra-ui/react";
import {useInfiniteScroll} from "../utils/useInfiniteScroll";
import {Loader} from "../components/infinite_scroll/Loader";
import {Box, Button, Flex, Heading, Image} from "@chakra-ui/react";

interface ProductCategoryInfo {
    category_name: string;
    subcategory_name: string;
    text: string;
}

const initialProductCategoryInfo: ProductCategoryInfo = {
    category_name: 'categoryName',
    subcategory_name: 'subcategoryName',
    text: 'סיכות',
};

export const ProductCategory = () => {
    let [page] = useState(1);  // TODO: add setPage
    const [productCategoryInfo] = useState(initialProductCategoryInfo);  // TODO: add setProductCategoryInfo
    const {
        isLoading,
        loadMoreCallback,
        getInitialProducts,
        hasDynamicProducts,
        dynamicProducts,
        isLastPage
    } = useInfiniteScroll([]);
    /* TODO: use productsPerPage */
    const productsPerPage = 10;

    useEffect(() => {
        getInitialProducts();
    }, []);

    return (
        <Box className="container">
            <Heading as='h2'>{productCategoryInfo.text}</Heading>
            <Box className="gallery">
                {dynamicProducts.map((product) => (
                    <Flex m={0} p={0} direction='column' justifyContent='flex-start' alignItems='center' width={['26vw', '26vw', '19vw']} mb={2} key={product.name}>
                        <ChakraLink sx={{width: 'inherit'}} as={ReactRouterLink} to={"/product/" + product._id}>
                            <Image objectFit='contain' w='100%' src={product.image_src} alt={product.name} />
                            {product.description}
                        </ChakraLink>
                        <Box className="price">{/* TODO: format price precision */ product.price}</Box>
                        <Button className="cart-button">הוסף לסל</Button>
                    </Flex>
                ))}

                { /* This gets a ref to the loader element to which we load content */ }
                <Loader
                    isLoading={isLoading}
                    isLastPage={isLastPage}
                    loadMoreCallback={loadMoreCallback}
                />
            </Box>
        </Box>
    );
}
export default ProductCategory;
