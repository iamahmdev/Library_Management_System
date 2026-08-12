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

router.post(
  "/add",
  isAuthenticated,
  isAdmin,
  upload.single("coverImage"),
  createBook,
);
router.get("/all", getAllBooks);
router.get("/:id", getSingleBook);
router.put(
  "/update/:id",
  isAuthenticated,
  isAdmin,
  upload.single("coverImage"),
  updateBook,
);
router.delete("/delete/:id", isAuthenticated, isAdmin, deleteBook);

export default router;
