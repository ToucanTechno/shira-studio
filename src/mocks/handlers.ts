import { http, HttpResponse } from 'msw';
import usersData from './data/usersArray.json';
import cartsData from './data/cartsArray.json';

export const handlers = [
    http.get('/api/carts', () => {
        return HttpResponse.json(cartsData, { status: 200 });
    }),
    http.get('/api/users', () => {
        return HttpResponse.json(usersData, { status: 200 });
    })
];