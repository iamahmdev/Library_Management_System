import Book from "../models/book.model.js";
import Borrow from "../models/borrow.model.js";

// Borrow Book - Only students can borrow books
export const borrowBook = async (req, res) => {
  try {
    console.log("User from token:", req.user); // Debug log
    
    // Only students can borrow books
    if (req.user.role !== "student") {
      return res.status(403).json({
        success: false,
        message: "Only students can borrow books",
      });
    }

    const { bookId } = req.body;

    if (!bookId) {
      return res.status(400).json({
        success: false,
        message: "Book ID is required",
      });
    }

    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    if (book.availableCopies <= 0) {
      return res.status(400).json({
        success: false,
        message: "Book is currently unavailable",
      });
    }

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14);

    const borrow = await Borrow.create({
      student: req.user.id, // Fixed: use id instead of _id
      book: bookId,
      dueDate,
    });

    book.availableCopies -= 1;
    await book.save();

    return res.status(201).json({
      success: true,
      message: "Book borrowed successfully",
      borrow,
    });
  } catch (error) {
    console.log("Borrow error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to borrow book",
      error: error.message
    });
  }
};

// Return Book - Student returns the borrowed book
export const returnBook = async (req, res) => {
  try {
    // Only students can return books
    if (req.user.role !== "student") {
      return res.status(403).json({
        success: false,
        message: "Only students can return books",
      });
    }

    const { borrowId } = req.body;

    if (!borrowId) {
      return res.status(400).json({
        success: false,
        message: "Borrow ID is required",
      });
    }

    const borrow = await Borrow.findById(borrowId);

    if (!borrow) {
      return res.status(404).json({
        success: false,
        message: "Borrow record not found",
      });
    }

    // Make sure this borrow belongs to the logged-in student
    if (borrow.student.toString() !== req.user.id.toString()) { // Fixed: use id
      return res.status(403).json({
        success: false,
        message: "You can only return your own borrowed books",
      });
    }

    // Check if book is already returned
    if (borrow.status === "returned") {
      return res.status(400).json({
        success: false,
        message: "Book has already been returned",
      });
    }

    const book = await Book.findById(borrow.book);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    // Update borrow record
    borrow.returnDate = new Date();
    borrow.status = "returned";
    await borrow.save();

    // Increase available copies
    book.availableCopies += 1;
    await book.save();

    return res.status(200).json({
      success: true,
      message: "Book returned successfully",
      borrow,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Failed to return book",
    });
  }
};

// Get My Borrowed Books - Student can view their own borrowed books
export const getMyBorrowedBooks = async (req, res) => {
  try {
    // Only students can view their borrowed books
    if (req.user.role !== "student") {
      return res.status(403).json({
        success: false,
        message: "Only students can view borrowed books",
      });
    }

    const borrowedBooks = await Borrow.find({
      student: req.user.id, // Fixed: use id instead of _id
    })
      .populate("book")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: borrowedBooks.length,
      borrowedBooks,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Failed to get borrowed books",
    });
  }
};

// Get All Borrowed Books - Admin can view all borrowing records
export const getAllBorrowedBooks = async (req, res) => {
  try {
    // Only admin can view all borrowed books
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admin can view all borrowed books",
      });
    }

    const borrowedBooks = await Borrow.find()
      .populate("student", "-password")
      .populate("book")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: borrowedBooks.length,
      borrowedBooks,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Failed to get all borrowed books",
    });
  }
};

// Get Overdue Books - Admin can view books that are overdue
export const getOverdueBooks = async (req, res) => {
  try {
    // Only admin can view overdue books
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admin can view overdue books",
      });
    }

    const overdueBooks = await Borrow.find({
      status: "borrowed",
      dueDate: { $lt: new Date() },
    })
      .populate("student", "-password")
      .populate("book")
      .sort({ dueDate: 1 });

    return res.status(200).json({
      success: true,
      count: overdueBooks.length,
      overdueBooks,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Failed to get overdue books",
    });
  }
};
