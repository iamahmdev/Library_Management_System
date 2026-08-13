import express from "express";

import {
  getAllStudents,
  getSingleStudent,
  deleteStudent,
} from "../controllers/admin.controller.js";

import { isAuthenticated, isAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Admin - Get All Students
router.get("/students", isAuthenticated, isAdmin, getAllStudents);

// Admin - Get Single Student
router.get("/students/:id", isAuthenticated, isAdmin, getSingleStudent);

// Admin - Delete Student
router.delete("/students/:id", isAuthenticated, isAdmin, deleteStudent);

export default router;
