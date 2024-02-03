import express, { Express } from "express/index.js";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import {productsRouter} from "./routes/productsRouter";
import {authRoutes} from "./routes/authRoutes";
import mongoose from "mongoose";

dotenv.config({path: "src/.env"});
if (process.env["DB_CONN_STRING"] === undefined || process.env["DB_NAME"] === undefined) {
    throw new Error("Missing DB Credentials.");
}
mongoose.connect(process.env["DB_CONN_STRING"], { dbName: process.env["DB_NAME"] });
const app: Express = express();
const port = process.env["PORT"] || 3001;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

app.use('/api/products', productsRouter);


//
// // Routes
// app.use('/api/orders', ordersRouter);
app.use('/api/auth', authRoutes);

export default app;
