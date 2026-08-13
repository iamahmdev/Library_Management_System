import express from "express";

import {
  borrowBook,
  returnBook,
  getMyBorrowedBooks,
  getAllBorrowedBooks,
  getOverdueBooks,
  getStudentDashboard,
} from "../controllers/borrow.controller.js";

import { isAuthenticated } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Student - Borrow Book
router.post("/borrow", isAuthenticated, borrowBook);

// Student - Return Book
router.post("/return", isAuthenticated, returnBook);

// Student - Get My Borrowed Books
router.get("/my", isAuthenticated, getMyBorrowedBooks);

// Student - Dashboard Stats
router.get("/dashboard", isAuthenticated, getStudentDashboard);

// Admin - Get All Borrowed Books
router.get("/all", isAuthenticated, getAllBorrowedBooks);

// Admin - Get Overdue Books
router.get("/overdue", isAuthenticated, getOverdueBooks);

export default router;
