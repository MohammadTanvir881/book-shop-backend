import { sendImageToCloudinary } from "../utlis/sendImageToCloudinary";
import { Book } from "./../books.model";
import { TBooks } from "./books.inheritance";
import { Types } from "mongoose"; // Import ObjectId from mongoose

// find all the books data from DB
const getBooksDataFromDb = async (query: Record<string, unknown>) => {
  const queryObject: any = { ...query };
  console.log(query);
  
  // Initialize search query
  const searchQuery: any = {};
  
  // ✅ Handle text-based searches (author, category, title)
  if (query.author) {
    searchQuery.author = { $regex: query.author, $options: "i" };
  }
  if (query.category) {
    searchQuery.category = { $regex: query.category, $options: "i" };
  }
  if (query.search) {
    searchQuery.$or = [
      { title: { $regex: query.search, $options: "i" } },
      { author: { $regex: query.search, $options: "i" } },
      { category: { $regex: query.search, $options: "i" } },
    ];
  }
  
  // ✅ Price range filter
  if (query.minPrice !== undefined || query.maxPrice !== undefined) {
    const priceFilter: any = {};
    if (query.minPrice !== undefined && !isNaN(Number(query.minPrice))) {
      priceFilter.$gte = Number(query.minPrice);
    }
    if (query.maxPrice !== undefined && !isNaN(Number(query.maxPrice))) {
      priceFilter.$lte = Number(query.maxPrice);
    }
    if (Object.keys(priceFilter).length > 0) {
      searchQuery.price = priceFilter;
    }
  }
  
  // ✅ Ensure availability is a boolean
  if (query.availability !== undefined) {
    searchQuery.availability = query.availability === "true";
  }
  
  // ✅ Remove unwanted fields
  const excludeFields = ["search", "sortBy", "sortOrder"];
  excludeFields.forEach((el) => delete queryObject[el]);
  
  // ✅ Merge filters
  const filterQuery = Book.find({ ...queryObject, ...searchQuery });
  
  // ✅ Sorting functionality with default sorting (newest first)
  if (typeof query.sortBy === "string" && query.sortBy.trim() !== "") {
    const order = query.sortOrder === "asc" ? 1 : -1;
    filterQuery.sort({ [query.sortBy]: order });
  } else {
    // ✅ Default sorting: newest products first
    filterQuery.sort({ createdAt: -1 });
  }
  
  // ✅ Execute query and populate author field
  const result = await filterQuery;
  
  return result;
  
};

// find a single book data here

const getSingleBookDataFromDb = async (id: string) => {
  // const result = await Book.findOne({ _id: id });
  const objectId = new Types.ObjectId(id);
  const result = await Book.aggregate([{ $match: { _id: objectId } }]);

  if (result.length === 0) {
    throw Error("Book not found");
  }

  console.log(result);
  return result;
};

// create a new book data in DB

const createBookDataIntoDB = async ( books: TBooks) => {
  //send image to cloudinary
  const imageName = `${books?.title}-${books?.author}`;
  // const path = file?.path;
  // const { secure_url }: any = await sendImageToCloudinary(imageName, path);

  // books.bookImage = secure_url;

  const result = await Book.create(books);
  return result;
};

// update the book data here
const updateBookDataIntoDb = async (
  id: string,
  updateData: Record<string, any>
) => {
  const result = await Book.findByIdAndUpdate(
    id,
    { $set: updateData },
    { new: true, runValidators: true }
  );
  return result;
};

// delete the book data here
const deleteDataFromDB = async (id: string) => {
  const result = await Book.updateOne({ _id: id }, { isDeleted: true });
  return result;
};

export const bookServices = {
  getBooksDataFromDb,
  createBookDataIntoDB,
  getSingleBookDataFromDb,
  updateBookDataIntoDb,
  deleteDataFromDB,
};
