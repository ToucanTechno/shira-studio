import {useNavigate} from "react-router-dom";
import React, {useEffect, useState} from "react";
import axios from 'axios'
import {IProduct} from "../../models/Product";

const AdminProducts = () => {
    let [page] = useState(0);  // TODO: add setPage
    const navigate = useNavigate();
    let [products, setProducts]: [IProduct[], any] = useState([]);
    const productsPerPage = 10;
    useEffect(() => {
        let skip = page * productsPerPage;
        axios.get(`http://localhost:3001/api/products?skip=${skip}&limit=${productsPerPage}`)
            .then(response => {
                // Process the response data
                console.log(response.data);
                setProducts(response.data.products);
            })
            .catch(error => {
                // Handle any errors
                console.error(error);
            });
    }, [page]);
    return (<div className={"container"}>
        <h1>ניהול מוצרים</h1>
        <div className="actionLine">
            <button className="adminButton"
                    onClick={() => navigate('/control-panel/products/add')}>הוספת מוצר חדש</button>
        </div>
        <table>
            <thead>
            <tr>
                <th>תמונה</th>
                <th>שם המוצר</th>
                <th>מק"ט</th>
                <th>מלאי</th>
                <th>מחיר</th>
                <th>קטגוריות</th>
                <th>תאריך הוספה</th>
                <th>תאריך שינוי</th>
                <th>תיאור המוצר</th>{/* TODO: move to line hover */}
                <th>צפיות</th>
                <th>פעולות</th>{/* TODO: move to name hover */}
            </tr>
            </thead>
            <tbody>
            { products.length > 0 && products.map((item: IProduct) => {
                console.log(item);
                return (
                <tr key={item._id}>
                    <td><img src="necklace.jpg" alt="Gold Necklace"/></td>
                    <td>שרשרת זהב</td>
                    <td>{item._id}</td>
                    <td>{item.stock}</td>
                    <td>{item.price}</td>
                    <td>{item.name}</td>
                    <td>{item.created?.toString()}</td>
                    <td>{item.modified?.toString()}</td>
                    <td>{item.description}</td>
                    <td>{item.views}</td>
                    <td>
                        <button className="adminButton"
                                onClick={() => navigate(`${item._id}/edit`)}>
                            עריכה
                        </button>
                        <button className="adminButton"
                                onClick={() => navigate(`${item._id}/delete`)}>
                            מחיקה
                        </button>
                    </td>
                </tr>
            )})}
            </tbody>
        </table>
    </div>)
};

export default AdminProducts;
