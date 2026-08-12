import Book from "../models/book.model.js";
import { v2 as cloudinary } from "cloudinary";

// Create Book
export const createBook = async (req, res) => {
  try {
    const { title, description, category, language, totalCopies } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Cover image is required",
      });
    }

    if (!title || !description || !category || !totalCopies) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "Library_collection",
    });

    const book = await Book.create({
      title,
      description,
      category,
      language,
      totalCopies,
      availableCopies: totalCopies,
      coverImage: {
        public_id: result.public_id,
        url: result.secure_url,
      },
      addedBy: "admin",
    });

    return res.status(201).json({
      success: true,
      message: "Book created successfully",
      book,
    });
  } catch (error) {
    console.log("Internal Server error", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create book",
    });
  }
};

// Get All Books with Search and Filters
export const getAllBooks = async (req, res) => {
  try {
    const { keyword, category, language, available } = req.query;

    const query = {};

    if (keyword) {
      query.title = { $regex: keyword, $options: "i" };
    }

    if (category) {
      query.category = category;
    }

    if (language) {
      query.language = {
        $regex: `${language}$`,
        $options: "i",
      };
    }

    if (available === "true") {
      query.availableCopies = { $gt: 0 };
    }

    if (available === "false") {
      query.availableCopies = 0;
    }

    const books = await Book.find(query).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: books.length,
      books,
    });
  } catch (error) {
    console.log("Internal Server error", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch books",
    });
  }
};

// Get Single Book By Params
export const getSingleBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    return res.status(200).json({
      success: true,
      book,
    });
  } catch (error) {
    console.log("Internal Server error", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch book",
    });
  }
};

// Update Book
export const updateBook = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      language,
      totalCopies,
      availableCopies,
    } = req.body;

    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    let updateData = {};

    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (category !== undefined) updateData.category = category;
    if (language !== undefined) updateData.language = language;
    if (totalCopies !== undefined) updateData.totalCopies = totalCopies;
    if (availableCopies !== undefined) {
      updateData.availableCopies = availableCopies;
    }

    if (req.file) {
      if (book.coverImage?.public_id) {
        await cloudinary.uploader.destroy(book.coverImage.public_id);
      }

      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "Library_collection",
      });

      updateData.coverImage = {
        public_id: result.public_id,
        url: result.secure_url,
      };
    }

    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      },
    );

    return res.status(200).json({
      success: true,
      message: "Book updated successfully",
      book: updatedBook,
    });
  } catch (error) {
    console.log("Internal Server error", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update book",
    });
  }
};

// Delete Book
export const deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    await book.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Book deleted successfully",
    });
  } catch (error) {
    console.log("Internal Server error", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete book",
    });
  }
};
