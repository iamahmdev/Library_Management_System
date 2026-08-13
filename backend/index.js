import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import dbConnect from "./config/db.js";
import authRouter from "./routes/auth.routes.js";
import connectCloudinary from "./config/cloudinary.js";
import bookRouter from "./routes/book.routes.js";
import borrowRoutes from "./routes/borrow.routes.js";
import adminRoutes from "./routes/admin.routes.js";

dotenv.config();
const app = express();

// ==================== Middleware Setup ====================
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
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

// ==================== Routes ====================
app.use("/api/auth", authRouter);
app.use("/api/books", bookRouter);
app.use("/api/borrow", borrowRoutes);
app.use("/api/admin", adminRoutes);

// ==================== Error Handling Middleware ====================
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({
    success: false,
    message: "Something went wrong!",
    error:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Internal server error",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Your server is Running on PORT ${PORT}`);
});
