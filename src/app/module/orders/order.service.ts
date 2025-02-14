import AppError from "../../Error/AppError";
import { Book } from "../books.model";
import { TOrders } from "./orders.inheritance";
import { Order } from "./orders.model";

const getAllOrdersFromDb = async () => {
  const result = Order.find();
  return result;
};

const createOrderIntoDB = async (orderData: TOrders) => {
  const { product, quantity } = orderData;
  console.log({ orderData });

  // find the product from book collection
  const bookProduct = await Book.findById(product);
  if (!bookProduct) {
    throw new Error("Product not found");
  }

  // The book quantity and order quantity is checking

  if (bookProduct.quantity < quantity) {
    throw new Error("Insufficient stock for the product");
  }

  // reduce book stock

  const updatedQuantity = bookProduct.quantity - quantity;
  bookProduct.quantity = updatedQuantity;
  if (updatedQuantity === 0) {
    bookProduct.inStock = false;
  }
  // save updated product
  await bookProduct.save();

  const result = await Order.create(orderData);
  return result;
};

const updateOrderIntoDb = async (orderId: string) => {
  const orderProduct = await Order.findById(orderId);
  if (!orderProduct) {
    throw new AppError(404, "Order Not Found");
  }
  const result = await Order.findByIdAndUpdate(
    orderId,
    { isShipped: true },
    { new: true, runValidators: true }
  );
  return result;
};

const deleteOrderIntoDb = async (orderId: string) => {
  const order = await Order.findById(orderId);
  if(!order){
    throw new AppError(404 , "Order not Found")
  }
  const result = await Order.findByIdAndDelete(orderId);
  return result;
};

export const orderServices = {
  createOrderIntoDB,
  getAllOrdersFromDb,
  updateOrderIntoDb,
  deleteOrderIntoDb,
};
