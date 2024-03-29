import express from "express";
import { changeCatMul, insertCategory } from "../controllers/categoryController";

export const categoryRoutes = express.Router();

categoryRoutes.post('/', insertCategory);

categoryRoutes.put("/:name/change", changeCatMul);

