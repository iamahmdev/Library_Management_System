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
router.post("/logout", logoutUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

// Private Routes
router.get("/me", isAuthenticated, getMyProfile);

export default router;
