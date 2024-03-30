import React, {useState} from "react";
import {Link} from "react-router-dom";
import {useInfiniteScroll} from "../utils/useInfiniteScroll";
import {Loader} from "../components/infinite_scroll/Loader";

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
    /* TODO: use productsPerPage */
    const productsPerPage = 10;

    return (
        <div className="container">
            <h2>{productCategoryInfo.text}</h2>
            <div className="gallery">
                {dynamicProducts.map((product) => (
                    <div className="gallery-item" key={product.name}>
                        <Link to={"/product/" + product._id}>
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
