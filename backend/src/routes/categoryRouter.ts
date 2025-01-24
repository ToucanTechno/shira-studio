import express from "express";
import { changeProducts, getAllCategories, getCategoryByParent, insertCategory } from "../controllers/categoryController";

export const categoryRoutes = express.Router();

categoryRoutes.get('/',getAllCategories);

categoryRoutes.get('/parent/:name', getCategoryByParent);

// TODO: add text field when editing/inserting a category
categoryRoutes.post('/', insertCategory);

// TODO: missing regular put query getting a category id/name and editing the name and parent of it.

categoryRoutes.put("/:name", changeProducts);

