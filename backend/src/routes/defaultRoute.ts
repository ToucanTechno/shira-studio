import { Router } from 'express';

export const defaultRoute = Router();

defaultRoute.get('/', (_req, res) => {
    res.send("default route unknown page");
});
