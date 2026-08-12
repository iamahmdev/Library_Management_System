import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import dbConnect from "./config/db.js";
import authRouter from "./routes/auth.routes.js";
import connectCloudinary from "./config/cloudinary.js";
import bookRouter from "./routes/book.routes.js";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);
// ==================== Database Connection ====================
dbConnect();

// ==================== Cloudinary Configuration ====================
connectCloudinary();

// ==================== User Routes ====================
app.use("/api/auth", authRouter);

// ==================== Books Routes ====================
app.use("/api/books", bookRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Your server is Running on PORT ${PORT}`);
});
