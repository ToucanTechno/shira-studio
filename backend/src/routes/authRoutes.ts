import express from "express";
import { login, profile, register } from "../controllers/userController";
import { authorize } from "../services/authorizationService";

export const authRoutes = express.Router();

// Registration route
authRoutes.post("/", register);

// Sign-in routes
authRoutes.post("/sign-in", login);

// Admin sign-in route
authRoutes.post("/admin/sign-in", login);

// Add debugging endpoint for GET requests to sign-in
authRoutes.get("/sign-in", (req, res) => {
    console.log('GET request received at /api/auth/sign-in');
    console.log('Query parameters:', req.query);
    res.status(200).send({ message: "Sign-in endpoint is working. Please use POST method for actual sign-in." });
});

// Add debugging endpoint for GET requests to admin sign-in
authRoutes.get("/admin/sign-in", (req, res) => {
    console.log('GET request received at /api/auth/admin/sign-in');
    console.log('Query parameters:', req.query);
    res.status(200).send({ message: "Admin sign-in endpoint is working. Please use POST method for actual admin sign-in." });
});

// User profile route (requires authentication)
authRoutes.get("/", authorize, profile);

// Admin protected route
// Import adminAuthorize only when needed
import { adminAuthorize } from "../services/authorizationService";
authRoutes.get("/admin", authorize, adminAuthorize, (_req, res) => {
    res.status(200).send({ message: "Admin access granted" });
});
