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

    const { bookId, dueDate } = req.body;

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

    // Use provided due date or default to 14 days
    let borrowDueDate;
    if (dueDate) {
      borrowDueDate = new Date(dueDate);
    } else {
      borrowDueDate = new Date();
      borrowDueDate.setDate(borrowDueDate.getDate() + 14);
    }

    const borrow = await Borrow.create({
      student: req.user.id, // Fixed: use id instead of _id
      book: bookId,
      dueDate: borrowDueDate,
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

// Get Student Dashboard Stats
export const getStudentDashboard = async (req, res) => {
  try {
    // Only students can access their dashboard
    if (req.user.role !== "student") {
      return res.status(403).json({
        success: false,
        message: "Only students can access this dashboard",
      });
    }

    const studentId = req.user.id;

    // My currently borrowed books count
    const currentlyBorrowed = await Borrow.countDocuments({
      student: studentId,
      status: "borrowed"
    });

    // My overdue books count
    const overdueBooks = await Borrow.countDocuments({
      student: studentId,
      status: "borrowed",
      dueDate: { $lt: new Date() }
    });

    // My total borrowing history
    const totalBorrowHistory = await Borrow.countDocuments({
      student: studentId
    });

    // Books returned on time vs late
    const returnedBooks = await Borrow.countDocuments({
      student: studentId,
      status: "returned"
    });

    // My recent borrowing activity (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentActivity = await Borrow.countDocuments({
      student: studentId,
      borrowDate: { $gte: thirtyDaysAgo }
    });

    // My currently borrowed books with details
    const myBorrowedBooks = await Borrow.find({
      student: studentId,
      status: "borrowed"
    }).populate("book", "title category").select("borrowDate dueDate");

    // Available books in library
    const availableBooks = await Book.countDocuments({
      availableCopies: { $gt: 0 }
    });

    return res.status(200).json({
      success: true,
      dashboard: {
        currentlyBorrowed,
        overdueBooks,
        totalBorrowHistory,
        returnedBooks,
        recentActivity,
        availableBooks,
        myBorrowedBooks
      }
    });
  } catch (error) {
    console.log("Error fetching student dashboard:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard statistics",
      error: error.message
    });
  }
};
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
