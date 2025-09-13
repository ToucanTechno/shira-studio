
import 'whatwg-fetch';
import '@testing-library/jest-dom';

// Basic objects are already mocked in jest.setup.js
// Now we can import MSW server without TextEncoder errors
import { server } from './mocks/server';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
