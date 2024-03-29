import React, {useEffect, useState} from "react";
import ProductSampleImage from "../assets/images/products/סיכת-אריזה.webp";
import {Link} from "react-router-dom";
import {IProduct} from "../models/Product";
import {useInfiniteScroll} from "../utils/useInfiniteScroll";
import {Loader} from "../components/infinite_scroll/Loader";
import axios from "axios";

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
        hasDynamicProducts,
        dynamicProducts,
        isLastPage
    } = useInfiniteScroll([]);
    const productsPerPage = 10;

    // useEffect(() => {
    //     let skip = page * productsPerPage;
    //     axios.get(`http://localhost:3001/api/products?skip=${skip}&limit=${page}`)
    //         .then(response => {
    //             // Process the response data
    //             setProducts(response.data);
    //         })
    //         .catch(error => {
    //             // Handle any errors
    //             console.error(error);
    //         });
    // }, [page]);

    return (
        <div className="container">
            <h2>{productCategoryInfo.text}</h2>
            <div className="gallery">
                {dynamicProducts.map((product) => (
                    <div className="gallery-item" key={product.name}>
                        <Link to={"/products/" + product.product_id}>
                            <img src={product.image_src} alt={product.name}/>
                            {product.description}
                        </Link>
                        <div className="price">{/* TODO: format price precision */ product.price}</div>
                        <button className="cart-button">הוסף לסל</button>
                    </div>
                ))}

                <Loader
                    isLoading={isLoading}
                    isLastPage={isLastPage}
                    loadMoreCallback={loadMoreCallback}
                />
            </div>
        </div>
    );
}
export default ProductCategory;
