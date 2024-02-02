import express from "express";
import { login, profile, register } from "../controllers/userController";
import {adminAuthorize, authorize} from "../services/authorizationService"

export const authRoutes = express.Router();
authRoutes.post("/users", register);
authRoutes.post("/users/sign-in", login);
authRoutes.get("/users", authorize, profile);
authRoutes.get("/admin", authorize, adminAuthorize, adminLogin)
