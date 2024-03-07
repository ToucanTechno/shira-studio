import {useParams} from "react-router-dom";
import React from "react";

const AdminProductsEdit = () => {
    const params = useParams();
    const isEdit = ('id' in params);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        console.log(event);
        event.preventDefault();
    }

    return (
        <div className="content">
            <h1>{(isEdit) ? "Edit Product" : "Add Product"}</h1>
            <form onSubmit={handleSubmit}>
                {isEdit &&
                    <>
                        <label htmlFor="productID">מזהה מוצר</label>
                        <input type="text" id="productID" name="productID" required/>
                    </>
                }

                <label htmlFor="productName">שם המוצר:</label>
                <input type="text" id="productName" name="productName" required/>

                <label htmlFor="categoriesDropdown">קטגוריות:</label>
                <select id="categoryDropdown" multiple>
                    <option value="category1">Category 1</option>
                    <option value="category2">Category 2</option>
                </select>

                <label htmlFor="price">מחיר:</label>
                <input type="number" id="price" name="price" step="0.01" required/>

                <label htmlFor="picture">תמונה:</label>
                <input type="file" id="picture" name="picture" required/>

                <label htmlFor="stock">מלאי:</label>
                <input type="number" id="stock" name="stock" required/>

                <label htmlFor="description">תיאור המוצר:</label>
                <textarea id="description" name="description" rows={4} required></textarea>

                <button type="submit">הוספת מוצר</button>
            </form>
        </div>
    )
};

export default AdminProductsEdit;
