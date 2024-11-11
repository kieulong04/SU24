import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from 'url';

import { connectDB } from "./config/db";
import authRouter from "./routers/auth";
import productRouter from "./routers/product";
import categoryRouter from "./routers/category";
import cartRouter from "./routers/cart";
import orderRouter from "./routers/order";
import attributeRouter from "./routers/attribute"; // Import attribute router
import serveUploads from "./middleware/serveUploads"; // Import middleware serveUploads

const app = express();
dotenv.config();
// middleware
app.use(express.json());
app.use(cors());
app.use(morgan("tiny"));

// connect db
connectDB(process.env.DB_URI);

// Lấy đường dẫn hiện tại và chuyển đổi thành đường dẫn thư mục
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Sử dụng middleware tùy chỉnh để phục vụ các tệp tĩnh từ thư mục uploads
app.use('/uploads', serveUploads);

// routers
app.use("/api/v1", authRouter);
app.use("/api/v1", productRouter);
app.use("/api/v1", categoryRouter);
app.use("/api/v1", cartRouter);
app.use("/api/v1", orderRouter);
app.use("/api/v1", attributeRouter); // Use attribute router

export const viteNodeApp = app;