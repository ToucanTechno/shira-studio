// src/CartList.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

type CartProductEntry = {
    product: string;
    amount: number;
    _id: string;
};

type Cart = {
    _id: string;
    products: { [productId: string]: CartProductEntry };
    lock: boolean | number;
    createdAt: string;
    updatedAt: string;
};

export default function CartList() {
    const [carts, setCarts] = useState<Cart[]>([]);

    useEffect(() => {
        axios.get('/api/carts')
            .then(res => {
                console.log('res.data:', res.data); // 🔍 should show an array of 6 items
                setCarts(res.data);
            })
            .catch(err => console.error('API error:', err));
    }, []);
    useEffect(() => {
        console.log('🧩 CartList mounted');

        return () => {
            console.warn('💥 CartList unmounted');
        };
    }, []);

    return (
        <div>
            <h2>Cart List</h2>
            <ul>
                {carts && carts.map(cart => (
                    <li key={cart._id} style={{ marginBottom: '1rem' }}>
                        <div><strong>Cart ID:</strong> {cart._id}</div>
                        <div><strong>Locked:</strong> {cart.lock ? 'Yes' : 'No'}</div>
                        <div><strong>Created:</strong> {new Date(cart.createdAt).toLocaleString()}</div>
                        <div><strong>Updated:</strong> {new Date(cart.updatedAt).toLocaleString()}</div>
                        <div><strong>Products:</strong>
                            <ul>
                                {Object.entries(cart.products).map(([productId, productItems]) => (
                                    <li key={productId}>
                                        Product ID: {productId} ({productItems.amount} items)
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
