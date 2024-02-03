import express from "express";
import { login, profile, register } from "../controllers/userController";
import {authorize} from "../services/authorizationService"
// adminAuthorize
export const authRoutes = express.Router();
authRoutes.post("/", register);
authRoutes.post("/sign-in", login);
authRoutes.get("/", authorize, profile);
// authRoutes.get("/admin", authorize, adminAuthorize, adminLogin)
