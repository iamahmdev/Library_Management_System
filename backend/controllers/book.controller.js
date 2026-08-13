import Book from "../models/book.model.js";
import { v2 as cloudinary } from "cloudinary";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

// Create Book
export const createBook = async (req, res) => {
  try {
    const { title, description, category, language, totalCopies } = req.body;

    console.log("Received data:", { title, description, category, language, totalCopies });
    console.log("File received:", req.file ? "Yes" : "No");
    console.log("User from token:", req.user);

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Cover image is required",
      });
    }

    if (!title || !description || !category || !totalCopies) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields: title, description, category, totalCopies",
      });
    }

    let result;
    if (req.file.buffer) {
      // Upload from memory buffer (recommended approach)
      result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            folder: "Library_collection",
            resource_type: "auto"
          },
          (error, uploadResult) => {
            if (error) return reject(error);
            resolve(uploadResult);
          }
        ).end(req.file.buffer);
      });
    } else if (req.file.path) {
      // Upload from file path (fallback)
      result = await cloudinary.uploader.upload(req.file.path, {
        folder: "Library_collection",
      });
    } else {
      throw new Error("No file buffer or path found");
    }

    console.log("Cloudinary upload result:", { public_id: result.public_id, url: result.secure_url });

    // For admin from .env, we'll use a placeholder ObjectId or find/create admin user in DB
    let addedByUserId;
    
    if (req.user.role === "admin" && req.user.email === process.env.ADMIN_EMAIL) {
      // Find or create admin user in database for ObjectId reference
      let adminUser = await User.findOne({ email: process.env.ADMIN_EMAIL });
      
      if (!adminUser) {
        console.log("Creating admin user in database for reference");
        adminUser = await User.create({
          name: "System Admin",
          email: process.env.ADMIN_EMAIL,
          password: await bcrypt.hash(process.env.ADMIN_PASSWORD, 10),
          role: "admin"
        });
      }
      addedByUserId = adminUser._id;
    } else {
      // For regular students
      addedByUserId = req.user.id;
    }

    const book = await Book.create({
      title: title.trim(),
      description: description.trim(),
      category,
      language: language || "English",
      totalCopies: parseInt(totalCopies),
      availableCopies: parseInt(totalCopies),
      coverImage: {
        public_id: result.public_id,
        url: result.secure_url,
      },
      addedBy: addedByUserId,
    });

    console.log("Book created successfully:", book._id);

    return res.status(201).json({
      success: true,
      message: "Book created successfully",
      book,
    });
  } catch (error) {
    console.log("Error creating book:", error);

    // Return actual error message for debugging
    return res.status(500).json({
      success: false,
      message: "Failed to create book",
      error: process.env.NODE_ENV === 'development' ? error.message : "Internal server error",
      details: error.stack
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
    console.log("Update request received for ID:", req.params.id);
    console.log("Request body:", req.body);
    console.log("File received:", req.file ? "Yes" : "No");

    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    // Build update data from form fields
    let updateData = {};
    if (req.body.title) updateData.title = req.body.title;
    if (req.body.description) updateData.description = req.body.description;
    if (req.body.category) updateData.category = req.body.category;
    if (req.body.language) updateData.language = req.body.language;
    if (req.body.totalCopies) updateData.totalCopies = parseInt(req.body.totalCopies);
    if (req.body.availableCopies) updateData.availableCopies = parseInt(req.body.availableCopies);

    // Handle file upload if provided
    if (req.file) {
      let result;
      if (req.file.buffer) {
        result = await new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream(
            { folder: "Library_collection" },
            (error, uploadResult) => {
              if (error) return reject(error);
              resolve(uploadResult);
            }
          ).end(req.file.buffer);
        });
      }
      
      updateData.coverImage = {
        public_id: result.public_id,
        url: result.secure_url,
      };
    }

    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: "Book updated successfully",
      book: updatedBook,
    });
  } catch (error) {
    console.log("Error updating book:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update book",
      error: error.message
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