import express from "express";
import {
  createBook,
  getAllBooks,
  getSingleBook,
  updateBook,
  deleteBook,
} from "../controllers/book.controller.js";

import { isAuthenticated, isAdmin } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.js";

const router = express.Router();

// ==================== Book Routes ====================

// GET all books - accessible at /api/books
router.get("/", getAllBooks);

router.post(
  "/add",
  isAuthenticated,
  isAdmin,
  upload.single("coverImage"),
  createBook,
);
router.get("/all", getAllBooks); // Keep this for backward compatibility
router.get("/:id", getSingleBook);
router.put("/:id", isAuthenticated, isAdmin, upload.single("coverImage"), updateBook);
router.put("/update/:id", isAuthenticated, isAdmin, upload.single("coverImage"), updateBook);
router.delete("/:id", isAuthenticated, isAdmin, deleteBook);
router.delete("/delete/:id", isAuthenticated, isAdmin, deleteBook); // Keep both for compatibility

export default router;
