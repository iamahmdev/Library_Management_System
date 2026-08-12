import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import dbConnect from "./config/db.js";
import authRouter from "./routes/auth.routes.js";

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

// DATABASE CONNECTION
dbConnect();

// Routes
app.use("/api/auth", authRouter);
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Your server is Running on PORT ${PORT}`);
});
