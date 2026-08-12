import mongoose from "mongoose";

export const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      enum: [
        "Fiction",
        "Non-Fiction",
        "Science",
        "History",
        "Technology",
        "Education",
        "other",
      ],
    },

    language: {
      type: String,
      default: "English",
      trim: true,
    },

    coverImage: {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },

    totalCopies: {
      type: Number,
      required: true,
      min: 1,
    },

    availableCopies: {
      type: Number,
      required: true,
      min: 0,
    },

    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Book = mongoose.model("Book", bookSchema);

export default Book;
