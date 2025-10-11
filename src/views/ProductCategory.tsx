'use client'

import React, {useEffect, useState} from "react";
import {Box, Heading, Spinner, Text} from "@chakra-ui/react";
import axios from "axios";
import {ProductGrid} from "../components/common/ProductGrid";
import { API_URL } from '../utils/apiConfig';

interface ProductCategoryInfo {
    _id: string;
    name: string;
    text: string;
    parent: string;
}

interface ProductCategoryProps {
    category: string;
    productCategory: string;
}

export const ProductCategory = ({ category, productCategory }: ProductCategoryProps) => {
    const [categoryInfo, setCategoryInfo] = useState<ProductCategoryInfo | null>(null);
    const [isFetchingCategory, setIsFetchingCategory] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCategoryData = async () => {
            try {
                setIsFetchingCategory(true);
                // Fetch only the category metadata without products (more efficient)
                const response = await axios.get<ProductCategoryInfo>(`${API_URL}/categories/name/${productCategory}`);
                setCategoryInfo(response.data);
            } catch (err) {
                console.error('Error fetching category:', err);
                setError('Failed to load category data');
            } finally {
                setIsFetchingCategory(false);
            }
        };

        fetchCategoryData();
    }, [category, productCategory]);

    if (isFetchingCategory) {
        return (
            <Box className="container" display="flex" justifyContent="center" alignItems="center" minH="400px">
                <Spinner size="xl" />
            </Box>
        );
    }

    if (error) {
        return (
            <Box className="container">
                <Text color="red.500" fontSize="xl">{error}</Text>
            </Box>
        );
    }

    if (!categoryInfo) {
        return (
            <Box className="container">
                <Text fontSize="xl">Category not found</Text>
            </Box>
        );
    }

    return (
        <Box className="container" py={6}>
            {/* Main Category Title */}
            <Heading
                as="h1"
                size="2xl"
                mb={8}
                textAlign="center"
                color="gray.800"
                fontWeight="bold"
            >
                {categoryInfo.text}
            </Heading>
            
            {/* Products Section */}
            <Box
                p={6}
                bg="white"
                borderRadius="lg"
                border="1px solid"
                borderColor="gray.200"
                boxShadow="sm"
            >
                <Heading
                    as="h3"
                    size="lg"
                    mb={6}
                    color="gray.700"
                    fontWeight="semibold"
                    borderBottom="2px solid"
                    borderColor="gray.300"
                    pb={3}
                >
                    מוצרים
                </Heading>
                <ProductGrid categoryName={productCategory} />
            </Box>
        </Box>
    );
}
export default ProductCategory;