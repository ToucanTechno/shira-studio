import express from "express";
import { changeCatMul, getAllCategories, getCategoryByParent, insertCategory } from "../controllers/categoryController";

export const categoryRoutes = express.Router();

categoryRoutes.get('/',getAllCategories);

categoryRoutes.get('/parent/:name', getCategoryByParent);

categoryRoutes.post('/', insertCategory);

// TODO: missing regular put query getting a category id/name and editing the name and parent of it.

categoryRoutes.put("/:name", changeCatMul);

