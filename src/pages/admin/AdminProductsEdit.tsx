import {useParams} from "react-router-dom";
import React, {useEffect, useRef, useState} from "react";
import {IProduct} from "../../models/Product";
import axios from "axios";

const AdminProductsEdit = () => {
    const params = useParams();
    const isEdit = ('id' in params);
    let [product, setProduct]: [null | IProduct, any] = useState(null);
    const productID = useRef<HTMLInputElement>(null);
    const productName = useRef<HTMLInputElement>(null);
    const productCategories = useRef<HTMLSelectElement>(null);
    const productPrice = useRef<HTMLInputElement>(null);
    const productImage = useRef<HTMLInputElement>(null);
    const productStock = useRef<HTMLInputElement>(null);
    const productDescription = useRef<HTMLTextAreaElement>(null);
    useEffect(() => {
        if (isEdit) {
            axios.get(`http://localhost:3001/api/products/${params['id']}`)
                .then(response => {
                    // Process the response data
                    setProduct(response.data);
                })
                .catch(error => {
                    // Handle any errors
                    console.error(error);
                });
        }
    }, [])

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        let product = {
            productID: productID.current?.value,
            productName: productName.current?.value,
            categories: productCategories.current ?
                Array.from(productCategories.current.selectedOptions, option => option.value) :
                [],
            price: productPrice.current?.value,
            image: productImage.current?.value,
            stock: productStock.current?.value,
            description: productDescription.current?.value
        };
        console.log(product);
        event.preventDefault();
    }

    return (
        <div className="content">
            <h1>{(isEdit) ? "Edit Product" : "Add Product"}</h1>
            <form onSubmit={handleSubmit}>
                {isEdit &&
                    <>
                        <label htmlFor="productID">מזהה מוצר</label>
                        <input type="text"
                               id="productID"
                               name="productID"
                               defaultValue={product ? product['_id'] : ''}
                               required
                               ref={productID}/>
                    </>
                }

                <label htmlFor="productName">שם המוצר:</label>
                <input type="text"
                       id="productName"
                       name="productName"
                       defaultValue={product ? product['name'] : ''}
                       required
                       ref={productName}/>

                <label htmlFor="categoriesDropdown">קטגוריות:</label>
                <select id="categoryDropdown" multiple ref={productCategories}>
                    <option value="category1">Category 1</option>
                    <option value="category2">Category 2</option>
                </select>

                <label htmlFor="price">מחיר:</label>
                <input type="number"
                       id="price"
                       name="price"
                       step="10"
                       defaultValue={product ? product['price'] : ''}
                       ref={productPrice}
                       required/>

                <label htmlFor="picture">תמונה:</label>
                <input type="file" id="picture" name="picture" required={!isEdit} ref={productImage}/>
                { product ? <img className="pictureImage" src={product['image_src']} /> : ''}

                <label htmlFor="stock">מלאי:</label>
                <input type="number"
                       id="stock"
                       name="stock"
                       defaultValue={product ? product['stock'] : ''}
                       required
                       ref={productStock}/>

                <label htmlFor="description">תיאור המוצר:</label>
                <textarea id="description"
                          name="description"
                          rows={4}
                          defaultValue={product ? product['description'] : ''}
                          ref={productDescription}>
                </textarea>

                <button type="submit">הוספת מוצר</button>
            </form>
        </div>
    )
};

export default AdminProductsEdit;
