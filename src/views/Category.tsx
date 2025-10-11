'use client'

import React, {useEffect, useState} from "react";
import Link from "next/link";
import { Link as ChakraLink } from '@chakra-ui/react'
import CategorySampleImage from '../../public/images/categories/רקמה7-1.webp'
import './Category.css'
import {Box, Heading, Spinner, Text} from "@chakra-ui/react";
import axios from "axios";
import {ProductGrid} from "../components/common/ProductGrid";
import { API_URL } from '../utils/apiConfig';
import { IProduct } from '../models/Product';

interface CategoryInfo {
    _id: string;
    name: string;
    text: string;
    parent: string;
    products: (string | IProduct)[];
}

interface CategoryProps {
    category: string;
}

const Category = ({ category }: CategoryProps) => {
    const [categoryInfo, setCategoryInfo] = useState<CategoryInfo | null>(null);
    const [subcategories, setSubcategories] = useState<CategoryInfo[]>([]);
    const [isLoadingCategory, setIsLoadingCategory] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCategoryData = async () => {
            try {
                setIsLoadingCategory(true);
                
                // Fetch the parent category info
                const categoryResponse = await axios.get<CategoryInfo>(`${API_URL}/categories/name/${category}`);
                setCategoryInfo(categoryResponse.data);
                
                // Fetch subcategories
                const subcategoriesResponse = await axios.get<CategoryInfo[]>(`${API_URL}/categories/parent/${category}`);
                setSubcategories(subcategoriesResponse.data);
            } catch (err) {
                console.error('Error fetching category:', err);
                setError('Failed to load category data');
            } finally {
                setIsLoadingCategory(false);
            }
        };

        fetchCategoryData();
    }, [category]);

    if (isLoadingCategory) {
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
            
            {/* Subcategories Section */}
            {subcategories.length > 0 && (
                <Box
                    mb={8}
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
                        קטגוריות
                    </Heading>
                    <Box className="gallery">
                        {subcategories.map(item => {
                            const productCount = item.products?.length || 0;
                            
                            // Get the first product's first image as thumbnail
                            let thumbnailUrl = CategorySampleImage.src; // Default fallback
                            
                            if (item.products && item.products.length > 0) {
                                const firstProduct = item.products[0];
                                // Check if it's a populated product object (not just an ID string)
                                if (typeof firstProduct === 'object' && firstProduct.images && firstProduct.images.length > 0) {
                                    // Sort images by order and get the first one
                                    const sortedImages = [...firstProduct.images].sort((a, b) => a.order - b.order);
                                    thumbnailUrl = sortedImages[0].url;
                                }
                            }
                            
                            return (
                                <Box className="gallery-item" key={item.name}>
                                    <ChakraLink as={Link} href={`/categories/${category}/${item.name}`}>
                                        <img src={thumbnailUrl} alt={item.text}/>
                                        {item.text} <mark>({productCount})</mark>
                                    </ChakraLink>
                                </Box>
                            )
                        })}
                    </Box>
                </Box>
            )}

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
                <ProductGrid categoryName={category} />
            </Box>

            {subcategories.length === 0 && (
                <Text fontSize="lg" mt={4}>אין תוכן זמין בקטגוריה זו.</Text>
            )}
        </Box>
    );
}

export default Category;