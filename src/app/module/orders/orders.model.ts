import { Schema, model } from "mongoose";
import { TOrders } from "./orders.inheritance";

const orderSchema = new Schema<TOrders>(
  {
    email: {
      type: String,
      required: [true, "Email is Required"],
    },
    product: {
      type: String,
      required: [true, "Product is required"],
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
    },
    totalPrice: {
      type: Number,
      required: [true, "Total price is required"],
    },
    address: {
      type: String,
      required: [true, "Address is required"],
    },
    phone: {
      type: Number,
      required: [true, "Phone Number is required"],
    },
    paidStatus: {
      type: Boolean,
    },
    tranjectionId: {
      type: String,
    },
    isShipped: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Order = model<TOrders>("Order", orderSchema);
