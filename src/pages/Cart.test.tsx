import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Cart from './Cart';
import { AuthContext } from '../services/AuthContext';
import { CartContext } from '../services/CartContext';
import { ChakraProvider } from '@chakra-ui/react';
import '@testing-library/jest-dom';

// Mock the CartOrder component
jest.mock('./CartOrder', () => {
    return function MockCartOrder({ totalPrice, cartID, cart, setCart, navigate }: any) {
        return (
            <div data-testid="cart-order">
                <div>Total: {totalPrice}</div>
                <div>Cart ID: {cartID}</div>
                <button onClick={() => navigate('/checkout')}>Proceed to Checkout</button>
            </div>
        );
    };
});

// Mock react-router
const mockNavigate = jest.fn();
jest.mock('react-router', () => ({
    useNavigate: () => mockNavigate,
}));

// Mock data
const mockProduct = {
    _id: 'product1',
    name: 'Test Product',
    price: 100,
    stock: 10
};

const mockCartWithItems = {
    _id: 'cart1',
    products: {
        'product1': {
            product: mockProduct,
            amount: 2
        }
    }
};

const mockEmptyCart = {
    _id: 'cart1',
    products: {}
};

const mockApi = {
    get: jest.fn(),
    put: jest.fn()
};

const mockTryLockCart = jest.fn();

const renderCartWithProviders = (authContextValue: any, cartContextValue: any) => {
    return render(
        <ChakraProvider>
            <BrowserRouter>
                <AuthContext.Provider value={authContextValue}>
                    <CartContext.Provider value={cartContextValue}>
                        <Cart />
                    </CartContext.Provider>
                </AuthContext.Provider>
            </BrowserRouter>
        </ChakraProvider>
    );
};

describe('Cart Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('When user is not signed in and has no cart', () => {
        it('should display empty cart message when guestData has no cartID', () => {
            const authContextValue = {
                api: mockApi,
                guestData: { cartID: null }
            };
            const cartContextValue = {
                tryLockCart: mockTryLockCart
            };

            renderCartWithProviders(authContextValue, cartContextValue);

            expect(screen.getByText('עגלת הקניות ריקה')).toBeInTheDocument();
        });
    });

    describe('When user has an empty cart', () => {
        it('should display empty cart message when cart has no products', async () => {
            mockApi.get.mockResolvedValue({ data: mockEmptyCart });

            const authContextValue = {
                api: mockApi,
                guestData: { cartID: 'cart1' }
            };
            const cartContextValue = {
                tryLockCart: mockTryLockCart
            };

            renderCartWithProviders(authContextValue, cartContextValue);

            await waitFor(() => {
                expect(screen.getByText('עגלת הקניות ריקה')).toBeInTheDocument();
            });

            expect(mockApi.get).toHaveBeenCalledWith('/cart/cart1');
        });
    });

    describe('When user has a cart with items', () => {
        beforeEach(() => {
            mockApi.get.mockResolvedValue({ data: mockCartWithItems });
            mockApi.put.mockResolvedValue({});
            mockTryLockCart.mockResolvedValue(false);
        });

        it('should display cart items and total price', async () => {
            const authContextValue = {
                api: mockApi,
                guestData: { cartID: 'cart1' }
            };
            const cartContextValue = {
                tryLockCart: mockTryLockCart
            };

            renderCartWithProviders(authContextValue, cartContextValue);

            await waitFor(() => {
                expect(screen.getByText('עגלת קניות')).toBeInTheDocument();
            });

            expect(screen.getByText('Test Product')).toBeInTheDocument();
            expect(screen.getByText('100₪')).toBeInTheDocument();
            expect(screen.getByTestId('cart-order')).toBeInTheDocument();
            expect(screen.getByText('Total: 200')).toBeInTheDocument(); // 2 * 100
        });

        it('should handle quantity change', async () => {
            const authContextValue = {
                api: mockApi,
                guestData: { cartID: 'cart1' }
            };
            const cartContextValue = {
                tryLockCart: mockTryLockCart
            };

            renderCartWithProviders(authContextValue, cartContextValue);

            await waitFor(() => {
                expect(screen.getByDisplayValue('2')).toBeInTheDocument();
            });

            const quantityInput = screen.getByDisplayValue('2');
            fireEvent.change(quantityInput, { target: { value: '3' } });

            await waitFor(() => {
                expect(mockApi.put).toHaveBeenCalledWith('/cart/cart1', {
                    productId: 'product1',
                    amount: 1 // difference between new (3) and old (2)
                });
            });
        });

        it('should handle item removal via close button', async () => {
            const authContextValue = {
                api: mockApi,
                guestData: { cartID: 'cart1' }
            };
            const cartContextValue = {
                tryLockCart: mockTryLockCart
            };

            renderCartWithProviders(authContextValue, cartContextValue);

            await waitFor(() => {
                expect(screen.getByText('Test Product')).toBeInTheDocument();
            });

            const closeButton = screen.getByRole('button', { name: /close/i });
            fireEvent.click(closeButton);

            await waitFor(() => {
                expect(mockApi.put).toHaveBeenCalledWith('/cart/cart1', {
                    productId: 'product1',
                    amount: -2 // remove all items (0 - 2)
                });
            });
        });

        it('should handle quantity increment/decrement buttons', async () => {
            const authContextValue = {
                api: mockApi,
                guestData: { cartID: 'cart1' }
            };
            const cartContextValue = {
                tryLockCart: mockTryLockCart
            };

            renderCartWithProviders(authContextValue, cartContextValue);

            await waitFor(() => {
                expect(screen.getByDisplayValue('2')).toBeInTheDocument();
            });

            const incrementButton = screen.getByLabelText('increment');
            fireEvent.click(incrementButton);

            await waitFor(() => {
                expect(mockApi.put).toHaveBeenCalledWith('/cart/cart1', {
                    productId: 'product1',
                    amount: 1
                });
            });
        });

        it('should show stock limitation toast when trying to exceed stock', async () => {
            const authContextValue = {
                api: mockApi,
                guestData: { cartID: 'cart1' }
            };
            const cartContextValue = {
                tryLockCart: mockTryLockCart
            };

            renderCartWithProviders(authContextValue, cartContextValue);

            await waitFor(() => {
                expect(screen.getByDisplayValue('2')).toBeInTheDocument();
            });

            const quantityInput = screen.getByDisplayValue('2');
            fireEvent.change(quantityInput, { target: { value: '15' } }); // Exceeds stock of 10

            await waitFor(() => {
                expect(screen.getByText('מלאי מוגבל')).toBeInTheDocument();
                expect(screen.getByText('מוצר: Test Product')).toBeInTheDocument();
            });

            // Should not make API call when exceeding stock
            expect(mockApi.put).not.toHaveBeenCalled();
        });
    });

    describe('Cart locking functionality', () => {
        beforeEach(() => {
            mockApi.get.mockResolvedValue({ data: mockCartWithItems });
            mockApi.put.mockResolvedValue({});
        });

        it('should handle cart locking/unlocking during quantity change', async () => {
            mockTryLockCart.mockResolvedValueOnce(true); // Was previously locked
            mockTryLockCart.mockResolvedValueOnce(false); // Re-lock successful

            const authContextValue = {
                api: mockApi,
                guestData: { cartID: 'cart1' }
            };
            const cartContextValue = {
                tryLockCart: mockTryLockCart
            };

            renderCartWithProviders(authContextValue, cartContextValue);

            await waitFor(() => {
                expect(screen.getByDisplayValue('2')).toBeInTheDocument();
            });

            const quantityInput = screen.getByDisplayValue('2');
            fireEvent.change(quantityInput, { target: { value: '3' } });

            await waitFor(() => {
                expect(mockTryLockCart).toHaveBeenCalledWith(false); // Unlock
                expect(mockTryLockCart).toHaveBeenCalledWith(true);  // Re-lock
                expect(mockApi.put).toHaveBeenCalled();
            });
        });

        it('should disable quantity input during lock process', async () => {
            mockTryLockCart.mockImplementation(() =>
                new Promise(resolve => {
                    setTimeout(() => resolve(true), 100);
                })
            );

            const authContextValue = {
                api: mockApi,
                guestData: { cartID: 'cart1' }
            };
            const cartContextValue = {
                tryLockCart: mockTryLockCart
            };

            renderCartWithProviders(authContextValue, cartContextValue);

            await waitFor(() => {
                expect(screen.getByDisplayValue('2')).toBeInTheDocument();
            });

            const quantityInput = screen.getByDisplayValue('2');
            fireEvent.change(quantityInput, { target: { value: '3' } });

            // Check if input gets disabled during lock process
            await waitFor(() => {
                expect(quantityInput).toBeDisabled();
            });
        });
    });

    describe('Navigation functionality', () => {
        it('should navigate to checkout when CartOrder button is clicked', async () => {
            mockApi.get.mockResolvedValue({ data: mockCartWithItems });

            const authContextValue = {
                api: mockApi,
                guestData: { cartID: 'cart1' }
            };
            const cartContextValue = {
                tryLockCart: mockTryLockCart
            };

            renderCartWithProviders(authContextValue, cartContextValue);

            await waitFor(() => {
                expect(screen.getByText('Proceed to Checkout')).toBeInTheDocument();
            });

            const checkoutButton = screen.getByText('Proceed to Checkout');
            fireEvent.click(checkoutButton);

            expect(mockNavigate).toHaveBeenCalledWith('/checkout');
        });
    });

    describe('Error handling', () => {
        it('should handle API errors when loading cart', async () => {
            const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
            mockApi.get.mockRejectedValue(new Error('API Error'));

            const authContextValue = {
                api: mockApi,
                guestData: { cartID: 'cart1' }
            };
            const cartContextValue = {
                tryLockCart: mockTryLockCart
            };

            renderCartWithProviders(authContextValue, cartContextValue);

            await waitFor(() => {
                expect(consoleLogSpy).toHaveBeenCalledWith('error:', expect.any(Error));
            });

            consoleLogSpy.mockRestore();
        });

        it('should handle API errors when updating cart', async () => {
            mockApi.get.mockResolvedValue({ data: mockCartWithItems });
            mockApi.put.mockRejectedValue(new Error('Update failed'));
            mockTryLockCart.mockResolvedValue(false);

            const authContextValue = {
                api: mockApi,
                guestData: { cartID: 'cart1' }
            };
            const cartContextValue = {
                tryLockCart: mockTryLockCart
            };

            renderCartWithProviders(authContextValue, cartContextValue);

            await waitFor(() => {
                expect(screen.getByDisplayValue('2')).toBeInTheDocument();
            });

            const quantityInput = screen.getByDisplayValue('2');
            fireEvent.change(quantityInput, { target: { value: '3' } });

            await waitFor(() => {
                expect(mockApi.put).toHaveBeenCalled();
            });
        });
    });

    describe('Edge cases', () => {
        it('should handle cart with zero quantity items', async () => {
            const cartWithZeroItem = {
                _id: 'cart1',
                products: {
                    'product1': {
                        product: mockProduct,
                        amount: 1
                    }
                }
            };

            mockApi.get.mockResolvedValue({ data: cartWithZeroItem });
            mockApi.put.mockResolvedValue({});
            mockTryLockCart.mockResolvedValue(false);

            const authContextValue = {
                api: mockApi,
                guestData: { cartID: 'cart1' }
            };
            const cartContextValue = {
                tryLockCart: mockTryLockCart
            };

            renderCartWithProviders(authContextValue, cartContextValue);

            await waitFor(() => {
                expect(screen.getByDisplayValue('1')).toBeInTheDocument();
            });

            const quantityInput = screen.getByDisplayValue('1');
            fireEvent.change(quantityInput, { target: { value: '0' } });

            await waitFor(() => {
                expect(mockApi.put).toHaveBeenCalledWith('/cart/cart1', {
                    productId: 'product1',
                    amount: -1
                });
            });
        });

        it('should handle same quantity change (no change)', async () => {
            mockApi.get.mockResolvedValue({ data: mockCartWithItems });
            mockTryLockCart.mockResolvedValue(false);

            const authContextValue = {
                api: mockApi,
                guestData: { cartID: 'cart1' }
            };
            const cartContextValue = {
                tryLockCart: mockTryLockCart
            };

            renderCartWithProviders(authContextValue, cartContextValue);

            await waitFor(() => {
                expect(screen.getByDisplayValue('2')).toBeInTheDocument();
            });

            const quantityInput = screen.getByDisplayValue('2');
            fireEvent.change(quantityInput, { target: { value: '2' } }); // Same value

            // Should not make API call for same quantity
            await waitFor(() => {
                expect(mockApi.put).not.toHaveBeenCalled();
            });
        });
    });
});