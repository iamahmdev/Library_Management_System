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
    origin: [
      "http://localhost:5174", 
      "http://localhost:5173",
      process.env.FRONTEND_URL // Add Vercel frontend URL from environment
    ].filter(Boolean), // Remove any undefined values
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

// ==================== Health Check Route ====================
app.get("/", (req, res) => {
  res.json({ 
    success: true, 
    message: "Library Management System API is running!",
    environment: process.env.NODE_ENV || "development"
  });
});

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

// Only start server if not in Vercel environment
if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Your server is Running on PORT ${PORT}`);
  });
}

// Export the Express app for Vercel
export default app;
