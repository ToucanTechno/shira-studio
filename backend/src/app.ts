import express, { Express } from "express/index.js";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import {productsRouter} from "./routes/productsRouter";
import {authRoutes} from "./routes/authRoutes";

dotenv.config({path: "src/.env"});

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
