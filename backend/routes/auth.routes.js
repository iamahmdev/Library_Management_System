import express from "express";
import {
  forgotPassword,
  getMyProfile,
  loginUser,
  logoutUser,
  registerStudent,
  resetPassword,
} from "../controllers/auth.controller.js";

import { isAuthenticated } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Public Routes
router.post("/register", registerStudent);
router.post("/login", loginUser);
router.get("/logout", logoutUser);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:token", resetPassword);

// Private Routes
router.get("/me", isAuthenticated, getMyProfile);

export default router;
