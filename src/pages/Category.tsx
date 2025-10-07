
'use client'

import React, {useEffect, useState} from "react";
import Link from "next/link";
import { Link as ChakraLink } from '@chakra-ui/react'
import CategorySampleImage from '../../public/images/categories/רקמה7-1.webp'
import './Category.css'
import {Box, Heading, Spinner, Text} from "@chakra-ui/react";
import axios from "axios";
import {ProductGrid} from "../components/common/ProductGrid";

interface CategoryInfo {
    _id: string;
    name: string;
    text: string;
    parent: string;
    products: string[];
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
                const categoryResponse = await axios.get<CategoryInfo>(`http://localhost:3001/api/categories/name/${category}`);
                setCategoryInfo(categoryResponse.data);
                
                // Fetch subcategories
                const subcategoriesResponse = await axios.get<CategoryInfo[]>(`http://localhost:3001/api/categories/parent/${category}`);
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
        <Box>
            <h2>{categoryInfo.text}</h2>
            
            {/* Subcategories Section */}
            {subcategories.length > 0 && (
                <Box mb={8}>
                    <Heading as="h3" size="md" mb={4}>קטגוריות</Heading>
                    <Box className="gallery">
                        {subcategories.map(item => {
                            return (
                                <Box className="gallery-item" key={item.name}>
                                    <ChakraLink as={Link} href={`/categories/${category}/${item.name}`}>
                                        <img src={CategorySampleImage.src} alt={item.name}/>
                                        {item.text} <mark>({item.products.length})</mark>
                                    </ChakraLink>
                                </Box>
                            )
                        })}
                    </Box>
                </Box>
            )}

            {/* Products Section */}
            <Box>
                <Heading as="h3" size="md" mb={4}>מוצרים</Heading>
                <ProductGrid categoryName={category} />
            </Box>

            {subcategories.length === 0 && (
                <Text fontSize="lg" mt={4}>אין תוכן זמין בקטגוריה זו.</Text>
            )}
        </Box>
    );
}

export default Category;