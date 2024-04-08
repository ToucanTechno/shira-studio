import express from "express";
import { changeCatMul, getAllCategories, getCategoryByParent, insertCategory } from "../controllers/categoryController";

export const categoryRoutes = express.Router();

categoryRoutes.get('/all',getAllCategories);

categoryRoutes.get('/parent/:name', getCategoryByParent);

categoryRoutes.post('/', insertCategory);

categoryRoutes.put("/:name/change", changeCatMul);

