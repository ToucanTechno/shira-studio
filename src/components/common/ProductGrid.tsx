'use client'

import React, {useEffect} from "react";
import Link from "next/link";
import {Link as ChakraLink} from "@chakra-ui/react";
import {Box, Button, Flex, Image, SimpleGrid} from "@chakra-ui/react";
import {useInfiniteScroll} from "../../utils/useInfiniteScroll";
import {Loader} from "../infinite_scroll/Loader";
import {IProduct} from "../../models/Product";

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

    useEffect(() => {
        getInitialProducts();
    }, [getInitialProducts]);

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
                                    src={firstImage?.url || '/placeholder-image.jpg'}
                                    alt={firstImage?.alt_text || product.name}
                                />
                                {product.description}
                            </ChakraLink>
                            <Box className="price">{product.price}</Box>
                            <Button className="cart-button">הוסף לסל</Button>
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