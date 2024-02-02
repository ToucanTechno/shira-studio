import express from "express";
import {defaultRoute} from "./defaultRoute";

export const orderRoutes = express.Router();

orderRoutes.use(defaultRoute);
