import {useParams} from "react-router-dom";
import React, {useEffect, useRef, useState} from "react";
import {IProduct} from "../../models/Product";
import axios from "axios";
import map from "core-js/fn/array/map";

const AdminProductsEdit = () => {
    const params = useParams();
    const isEdit = ('id' in params);
    let [product, setProduct]: [null | IProduct, any] = useState(null);
    const productRefs = {
        ID: useRef<HTMLInputElement>(null),
        name: useRef<HTMLInputElement>(null),
        categories: useRef<HTMLSelectElement>(null),
        price: useRef<HTMLInputElement>(null),
        image: useRef<HTMLInputElement>(null),
        stock: useRef<HTMLInputElement>(null),
        description: useRef<HTMLTextAreaElement>(null),
        submit: useRef<HTMLButtonElement>(null)
    }
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
    }, [isEdit, params])

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        let update = {
            productID: productRefs.ID.current?.value,
            productName: productRefs.name.current?.value,
            categories: productRefs.categories.current ?
                Array.from(productRefs.categories.current.selectedOptions, option => option.value) :
                [],
            price: productRefs.price.current?.value,
            image: productRefs.image.current?.value,
            stock: productRefs.stock.current?.value,
            description: productRefs.description.current?.value
        };
        if (product && update.image === "") {
            // keep image
            update.image = product['image_src']
        }
        // TODO: select categories
        console.log(update);
        let updateEntry: IProduct = {
            product_id: update.productID as string,
            name: update.productName as string,
            categories: update.categories, // TODO: update IProduct to include multiple categories
            price: parseInt(update.price as string),
            image_src: update.image as string,
            description: update.description as string,
            stock: parseInt(update.stock as string)
        };

        if (isEdit) {
            const updateURL = `http://localhost:3001/api/products/${params['id']}`;
            axios.put<IProduct>(updateURL, updateEntry).then(response => {
                console.log(response);
            })
            .catch(error => {
                console.error(error);
            });
        } else {
            const updateURL = `http://localhost:3001/api/products/`;
            axios.post<IProduct>(updateURL, updateEntry).then(response => {
                console.log(response);
            })
            .catch(error => {
                console.error(error);
            });
        }
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
                               disabled
                               ref={productRefs.ID}/>
                    </>
                }

                <label htmlFor="productName">שם המוצר:</label>
                <input type="text"
                       id="productName"
                       name="productName"
                       defaultValue={product ? product['name'] : ''}
                       required
                       ref={productRefs.name}/>

                {/* TODO: Choose categories as in DB */}
                <label htmlFor="categoriesDropdown">קטגוריות:</label>
                <select id="categoryDropdown" multiple ref={productRefs.categories}>
                    <option value="category1">Category 1</option>
                    <option value="category2">Category 2</option>
                </select>

                <label htmlFor="price">מחיר:</label>
                <input type="number"
                       id="price"
                       name="price"
                       step="10"
                       defaultValue={product ? product['price'] : ''}
                       ref={productRefs.price}
                       required/>

                <label htmlFor="picture">תמונה:</label>
                <input type="file" id="picture" name="picture" required={!isEdit} ref={productRefs.image}/>
                { product ? <img className="pictureImage" alt={product['name']} src={product['image_src']} /> : ''}

                <label htmlFor="stock">מלאי:</label>
                <input type="number"
                       id="stock"
                       name="stock"
                       defaultValue={product ? product['stock'] : ''}
                       required
                       ref={productRefs.stock}/>

                <label htmlFor="description">תיאור המוצר:</label>
                <textarea id="description"
                          name="description"
                          rows={4}
                          defaultValue={product ? product['description'] : ''}
                          ref={productRefs.description}>
                </textarea>

                <button type="submit" ref={productRefs.submit}>{ isEdit ? "עריכת מוצר" : "הוספת מוצר" }</button>
            </form>
        </div>
    )
};

export default AdminProductsEdit;
