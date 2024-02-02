import React, {useReducer, useState} from "react";
import ProductSampleImage from "../assets/images/products/סיכת-אריזה.webp";
import {Link, useParams} from "react-router-dom";
import {ImageFetchAction} from '../utils/InfiniteScrollUtils'

interface ProductCategoryInfo {
    name: string;
    link: string;
    text: string;
    num_products: number;
    image_src: any;
};

interface ProductCategoryState {
    productCategoryInfo: {
        name: string;
        text: string;
        categories: ProductCategoryInfo[];
    }
};

function ProductCategory(props: any) {

    let { category, productCategory } = useParams();
    const [galleryState,
        useFetchsetGalleryState] = useState({
        productCategoryInfo: {
            category_name: category,
            subcategory_name: productCategory,
            text: 'סיכות',
            products: [
                {name: 'product1', link: '/product/product1', text: 'מוצר 1', price: 600.0, image_src: ProductSampleImage},
                {name: 'product2', link: '/product/product2', text: 'מוצר 2', price: 400.2, image_src: ProductSampleImage},
                {name: 'product3', link: '/product/product3', text: 'מוצר 3', price: 200, image_src: ProductSampleImage},
                {name: 'product4', link: '/product/product4', text: 'מוצר 4', price: 1.013, image_src: ProductSampleImage},
                {name: 'product5', link: '/product/product5', text: 'מוצר 5', price: 0, image_src: ProductSampleImage},
                {name: 'product6', link: '/product/product5', text: 'מוצר 5', price: 0, image_src: ProductSampleImage},
                {name: 'product7', link: '/product/product5', text: 'מוצר 5', price: 0, image_src: ProductSampleImage},
                {name: 'product8', link: '/product/product5', text: 'מוצר 5', price: 0, image_src: ProductSampleImage},
                {name: 'product9', link: '/product/product5', text: 'מוצר 5', price: 0, image_src: ProductSampleImage},
                {name: 'product10', link: '/product/product5', text: 'מוצר 5', price: 0, image_src: ProductSampleImage},
                {name: 'product11', link: '/product/product5', text: 'מוצר 5', price: 0, image_src: ProductSampleImage},
                {name: 'product12', link: '/product/product5', text: 'מוצר 5', price: 0, image_src: ProductSampleImage},
                {name: 'product13', link: '/product/product5', text: 'מוצר 5', price: 0, image_src: ProductSampleImage},
                {name: 'product14', link: '/product/product5', text: 'מוצר 5', price: 0, image_src: ProductSampleImage},
                {name: 'product15', link: '/product/product5', text: 'מוצר 5', price: 0, image_src: ProductSampleImage},
                {name: 'product16', link: '/product/product5', text: 'מוצר 5', price: 0, image_src: ProductSampleImage},
                {name: 'product17', link: '/product/product5', text: 'מוצר 5', price: 0, image_src: ProductSampleImage},
                {name: 'product18', link: '/product/product5', text: 'מוצר 5', price: 0, image_src: ProductSampleImage},
                {name: 'product19', link: '/product/product5', text: 'מוצר 5', price: 0, image_src: ProductSampleImage},
                {name: 'product20', link: '/product/product5', text: 'מוצר 5', price: 0, image_src: ProductSampleImage},
            ]
        }
    });

    const imgReducer = (state: {images: string[], fetching: boolean}, action: {type: ImageFetchAction, images: string[], fetching: boolean}) => {
        switch (action.type) {
            case ImageFetchAction.STACK_IMAGES:
                return { ...state, images: state.images.concat(action.images) }
            case ImageFetchAction.FETCHING_IMAGES:
                return { ...state, fetching: action.fetching }
            default:
                return state;
        }
    }
    const [imgData, imgDispatch] = useReducer(imgReducer,{ images:[], fetching: true})

    return (
        <div className="container">
            <h2>{galleryState.productCategoryInfo.text}</h2>
            <div className="gallery">
                {galleryState.productCategoryInfo.products.map(item => {
                    return (
                        <div className="gallery-item" key={item.name}>
                            <Link to={item.link}>
                                <img src={item.image_src} alt={item.name}/>
                                {item.text}
                            </Link>
                            <div className="price">{/* TODO: format price percision */ item.price}</div>
                            <button className="cart-button">הוסף לסל</button>
                        </div>
                    )
                })}
            </div>
        </div>
    );
}
export default ProductCategory;
