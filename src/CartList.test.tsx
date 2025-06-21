// src/CartList.test.tsx
import React from 'react';
import {render, screen, waitFor, within} from '@testing-library/react';
import '@testing-library/jest-dom';
import CartList from './CartList';
import { server } from './mocks/server'; // Assuming you have a setup like this
// import { cartsData as mockData } from './mocks/data'; // Import your mock data

import mockData from './mocks/data/cartsArray.json';

// Establish API mocking before all tests.
beforeAll(() => server.listen());

// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(() => server.resetHandlers());

// Clean up after the tests are finished.
afterAll(() => server.close());


test('renders cart list from mock data', async () => {
    render(<CartList />);

    // 1. Find a unique identifier for the FIRST cart. The cart ID is perfect for this.
    // We wait for it to ensure the API call has completed and the component has rendered.
    const firstCartIdElement = await screen.findByText(mockData[0]._id);
    expect(firstCartIdElement).toBeInTheDocument();

    // 2. Find the parent container of that cart. Looking at the HTML, it's an `<li>`.
    // This gives us a "scope" or "slice" of the DOM to search within.
    const firstCartContainer = firstCartIdElement.closest('li');
    expect(firstCartContainer).not.toBeNull(); // Good practice to ensure we found the container

    // 3. Use the `within` utility to search ONLY inside the first cart's container.
    // Note: We use `getByText` here instead of `findByText` because the content is already
    // on the screen. We waited for the parent container, so its children are present.
    const { getByText } = within(firstCartContainer!); // The '!' tells TypeScript we know it's not null.

    // 4. Now, assert the specific products for the FIRST cart.
    // Based on your mock data, the first cart has products with 2 and 4 items.
    expect(getByText(/2 items/i)).toBeInTheDocument();
    expect(getByText(/4 items/i)).toBeInTheDocument();

    // This assertion is now specific and robust. It will no longer find
    // the "2 items" text from other carts.
});
