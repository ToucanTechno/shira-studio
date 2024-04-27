import React, {useState} from "react";
import {Link as ReactRouterLink, useParams} from 'react-router-dom'
import { Link as ChakraLink } from '@chakra-ui/react'
import CategorySampleImage from '../assets/images/categories/רקמה7-1.webp'
import './Category.css'
import {Box} from "@chakra-ui/react";

const Category = () => {
    const params = useParams();
    const [category, setCategory] = useState({
        name: params.category,
        text: 'תכשיטים',
        categories: [
            {name: 'brooches', link: `/categories/${params.category}/brooches`, text: 'סיכות', num_products: 49, image_src: CategorySampleImage},
            {name: 'earrings', link: `/categories/${params.category}/earrings`, text: 'עגילים', num_products: 48, image_src: CategorySampleImage},
            {name: 'bracelets', link: `/categories/${params.category}/bracelets`, text: 'צמידים', num_products: 8, image_src: CategorySampleImage},
            {name: 'necklaces', link: `/categories/${params.category}/necklaces`, text: 'שרשראות', num_products: 30, image_src: CategorySampleImage},
            {name: 'body_jewelry', link: `/categories/${params.category}/body_jewelry`, text: 'תכשיטי גוף', num_products: 9, image_src: CategorySampleImage}
        ]
    });

    return (
        <Box>
            <h2>{category.text}</h2>
            <Box className="gallery">
                {category.categories.map(item => {
                    return (
                        <Box className="gallery-item" key={item.name}>
                            <ChakraLink as={ReactRouterLink} to={item.link}>
                                <img src={item.image_src} alt={item.name}/>
                                {item.text} <mark>({item.num_products})</mark>
                            </ChakraLink>
                        </Box>
                    )
                })}
            </Box>
        </Box>
    );
}

export default Category;
