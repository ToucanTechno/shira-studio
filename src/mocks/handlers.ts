import { rest } from 'msw';
import usersData from './data/usersArray.json';
import cartsData from './data/cartsArray.json';

export const handlers = [
    rest.get('/api/carts', (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json(cartsData)
        );
    }),
    rest.get('/api/users', (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json(usersData)
        );
    })
];