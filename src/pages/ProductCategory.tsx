import React, {useState} from "react";
import ProductSampleImage from "../assets/images/products/סיכת-אריזה.webp";
import {Link} from "react-router-dom";
import {IProduct} from "../models/Product";
import {useInfiniteScroll} from "../utils/useInfiniteScroll";
import {Loader} from "../components/infinite_scroll/Loader";

interface ProductCategoryInfo {
    category_name: string;
    subcategory_name: string;
    text: string;
    products: IProduct[];
};

const initialProductCategoryInfo: ProductCategoryInfo = {
    category_name: 'categoryName',
    subcategory_name: 'subcategoryName',
    text: 'סיכות',
    products: [
        {name: 'product1', category_id: '1', product_id: 'product1', description: 'מוצר 1', price: 600.0, image_src: ProductSampleImage},
        {name: 'product2', category_id: '1', product_id: 'product2', description: 'מוצר 2', price: 400.2, image_src: ProductSampleImage},
        {name: 'product3', category_id: '1', product_id: 'product3', description: 'מוצר 3', price: 200, image_src: ProductSampleImage},
        {name: 'product4', category_id: '1', product_id: 'product4', description: 'מוצר 4', price: 1.013, image_src: ProductSampleImage},
        {name: 'product5', category_id: '1', product_id: 'product5', description: 'מוצר 5', price: 0, image_src: ProductSampleImage},
        {name: 'product6', category_id: '1', product_id: 'product6', description: 'מוצר 5', price: 0, image_src: ProductSampleImage},
        {name: 'product7', category_id: '1', product_id: 'product7', description: 'מוצר 5', price: 0, image_src: ProductSampleImage},
        {name: 'product8', category_id: '1', product_id: 'product8', description: 'מוצר 5', price: 0, image_src: ProductSampleImage},
        {name: 'product10', category_id: '1', product_id: 'product9', description: 'מוצר 5', price: 0, image_src: ProductSampleImage},
        {name: 'product11', category_id: '1', product_id: 'product10', description: 'מוצר 5', price: 0, image_src: ProductSampleImage},
        {name: 'product12', category_id: '1', product_id: 'product11', description: 'מוצר 5', price: 0, image_src: ProductSampleImage},
        {name: 'product13', category_id: '1', product_id: 'product12', description: 'מוצר 5', price: 0, image_src: ProductSampleImage},
        {name: 'product14', category_id: '1', product_id: 'product13', description: 'מוצר 5', price: 0, image_src: ProductSampleImage},
        {name: 'product15', category_id: '1', product_id: 'product14', description: 'מוצר 5', price: 0, image_src: ProductSampleImage},
        {name: 'product16', category_id: '1', product_id: 'product15', description: 'מוצר 5', price: 0, image_src: ProductSampleImage},
        {name: 'product17', category_id: '1', product_id: 'product16', description: 'מוצר 5', price: 0, image_src: ProductSampleImage},
        {name: 'product18', category_id: '1', product_id: 'product17', description: 'מוצר 5', price: 0, image_src: ProductSampleImage},
        {name: 'product19', category_id: '1', product_id: 'product18', description: 'מוצר 5', price: 0, image_src: ProductSampleImage},
        {name: 'product20', category_id: '1', product_id: 'product19', description: 'מוצר 5', price: 0, image_src: ProductSampleImage},
    ]
};

export const ProductCategory = () => {
    const [productCategoryInfo, setProductCategoryInfo] = useState(initialProductCategoryInfo);
    const {
        isLoading,
        loadMoreCallback,
        hasDynamicProducts,
        dynamicProducts,
        isLastPage,
    } = useInfiniteScroll(productCategoryInfo.products);

    return (
        <div className="container">
            <h2>{productCategoryInfo.text}</h2>
            <div className="gallery">
                {productCategoryInfo.products.map(item => {
                    return (
                        <div className="gallery-item" key={item.name}>
                            <Link to={"/products/" + item.product_id}>
                                <img src={item.image_src} alt={item.name}/>
                                {item.description}
                            </Link>
                            <div className="price">{/* TODO: format price percision */ item.price}</div>
                            <button className="cart-button">הוסף לסל</button>
                        </div>
                    )
                })}
                {productCategoryInfo.products.map((product) => (
                    <div className="gallery-item" key={product.name}>
                        <Link to={"/products/" + product.product_id}>
                            <img src={product.image_src} alt={product.name}/>
                            {product.description}
                        </Link>
                        <div className="price">{/* TODO: format price percision */ product.price}</div>
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
