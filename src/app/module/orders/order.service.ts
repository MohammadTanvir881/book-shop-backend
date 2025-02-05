import { Book } from "../books.model";
import { TOrders } from "./orders.inheritance";
import { Order } from "./orders.model";

const createOrderIntoDB = async (orderData: TOrders) => {
  const { product, quantity } = orderData;
  console.log({orderData});

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

export const orderServices = {
  createOrderIntoDB,
};
