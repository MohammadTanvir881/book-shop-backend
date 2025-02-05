import { Schema, model } from "mongoose";
import { TBooks } from "./books/books.inheritance";

const booksSchema = new Schema<TBooks>(
  {
    title: {
      type: String,
      required: [true, "Books Title Are Required"],
    },
    bookImage : {
      type : String,
    },
    author: {
      type: String,
      required: [true, "Author is Required"],
    },
    price: {
      type: Number,
      required: [true, "Price is Required"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
    },
    inStock: {
      type: Boolean,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// mongoose query middleware

// filter the data before the finding result of all the books
booksSchema.pre("find", function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

// filter the deleted single data
booksSchema.pre("aggregate", function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

export const Book = model<TBooks>("Book", booksSchema);
