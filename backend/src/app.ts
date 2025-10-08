import express, { Express } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import {productsRouter} from "./routes/productsRouter";
import {authRoutes} from "./routes/authRoutes";
import mongoose from "mongoose";
import { cartRoutes } from "./routes/cartRoutes";
import { categoryRoutes } from "./routes/categoryRouter";
import { orderRoutes } from "./routes/orderRoutes";

// Load environment variables.
dotenv.config();

// --- Database Connection ---
if (process.env["DB_CONN_STRING"] === undefined) {
    console.warn("Warning: Missing DB_CONN_STRING environment variable. Using default.");
}

// Get base connection string
let connectionString = process.env["DB_CONN_STRING"] || "mongodb://localhost:27017/";

// Add database name if not already in the connection string
if (process.env['DB_NAME']) {
    // Ensure there's a forward slash before the database name
    if (!connectionString.endsWith('/')) {
        connectionString += '/';
    }
    connectionString += process.env["DB_NAME"];
}

// Add replica set parameter if specified
// if (process.env["REPLICA_NAME"]) {
//     connectionString += '?replicaSet=' + process.env["REPLICA_NAME"];
// }

console.log("Connecting to MongoDB at", connectionString);

// Connect to MongoDB
mongoose.connect(connectionString)
    .then(() => console.log("✅ Connected to MongoDB successfully"))
    .catch((error) => {
        console.error("❌ Error connecting to MongoDB:", error);
        console.log("\nTroubleshooting tips:");
        console.log("1. Make sure MongoDB is running");
        console.log("2. Check if the connection string is correct");
        console.log("3. If using a replica set, ensure it's properly configured");
        console.log("4. Try connecting without replica set parameters for local development");
        process.exit(1);
    });
const app: Express = express();
const port = process.env["PORT"] || 3001;

// --- Middleware ---
// Configure CORS to allow requests from frontend
const allowedOrigins = [
    'http://localhost:3000',  // Local development
    'https://shira-studio.vercel.app',  // Production Vercel domain
    process.env['FRONTEND_URL']  // Additional frontend URL from environment (optional)
].filter(Boolean);  // Remove undefined values

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            console.warn(`CORS blocked request from origin: ${origin}`);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true  // Allow cookies and authentication headers
}));
app.use(bodyParser.json());

// --- API Routes ---
app.use('/api/products', productsRouter);
app.use('/api/auth', authRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/categories', categoryRoutes)
app.use('/api/orders', orderRoutes);

// A simple root route to check if the server is up
app.get('/', (_req, res) => {
    res.send('Backend API is running!');
});

// --- Start the Server ---
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

export default app;
