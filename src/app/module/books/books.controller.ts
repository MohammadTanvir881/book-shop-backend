import { Request, Response } from "express";
import { bookServices } from "./books.services";
import booksZodValidationSchema from "./books.zodValidation";
import catchAsync from "../utlis/catchAsync";

const createBookData = catchAsync(async (req, res) => {
  // console.log(req.file);
  console.log(req.body)
  const result = await bookServices.createBookDataIntoDB(req.body );
  res.status(200).json({
    success: true,
    message: "Books Created successfully",
    statusCode: 200,
    // data: result,
  });
});

// get all the books data here
const getBooksData = async (req: Request, res: Response) => {
  try {
    const query = req.query;
    const result = await bookServices.getBooksDataFromDb(query);
    res.status(200).json({
      message: "Books retrieved successfully",
      status: true,
      res: result,
    });
  } catch (error: any) {
    res.status(500).json({
      message: "Something Went Wrong",
      status: false,
      error: error,
    });
  }
};

// get single book data using id here

const getSingleBookData = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    // console.log(productId);
    const result = await bookServices.getSingleBookDataFromDb(productId);

    res.status(200).json({
      message: "Books retrieved successfully",
      status: true,
      res: result,
    });
  } catch (error: any) {
    res.status(500).json({
      message: "Product not found",
      status: false,
      error: error,
    });
  }
};

//  update a book here
const updateBookData = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const updateBookData = req.body;

    const result = await bookServices.updateBookDataIntoDb(
      productId,
      updateBookData
    );
    res.status(200).json({
      message: "Book updated successfully",
      status: true,
      res: result,
    });
  } catch (error: any) {
    res.status(500).json({
      message: "something went wrong",
      status: false,
      error: error.message,
    });
  }
};

// delete book data here

const deleteBookData = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const result = await bookServices.deleteDataFromDB(productId);
    res.status(200).json({
      message: "Book deleted successfully",
      status: true,
      res: result,
    });
  } catch (error: any) {
    res.status(500).json({
      message: "Something went wrong",
      status: false,
      error: error.message,
    });
  }
};

export const booksController = {
  getBooksData,
  createBookData,
  getSingleBookData,
  updateBookData,
  deleteBookData,
};
