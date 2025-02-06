const SSLCommerzPayment = require("sslcommerz-lts");
import { Request, Response } from "express";
import { orderServices } from "./order.service";
import { totalRevenueIncome } from "./revenue";
import config from "../../config";
import mongoose from "mongoose";
import app from "../../../app";
import { Order } from "./orders.model";
import catchAsync from "../utlis/catchAsync";
// import { totalRevenueIncome } from "./revenue";

const store_id = config.store_id;
const store_passwd = config.store_password;
const is_live = false; //true for live, false for sandbox

const tran_id = new mongoose.Types.ObjectId().toString();

const getAllOrders = catchAsync(async (req, res) => {
  const result = await orderServices.getAllOrdersFromDb();
  res.status(200).json({
    success: true,
    statusCode: 200,
    message: "Orders Retrieved Successfully",
    data: result,
  });
});

const createOrder = async (req: Request, res: Response) => {
  try {
    const order = req.body;
    // console.log(order);

    const data = {
      total_amount: order.totalPrice,
      currency: "BDT",
      tran_id: tran_id, // use unique tran_id for each api call
      success_url: `https://book-shop-as.vercel.app/payment/payment/success/${tran_id}`,
      fail_url: `https://book-shop-as.vercel.app/payment/payment/fail/${tran_id}`,
      cancel_url: "http://localhost:3030/cancel",
      ipn_url: "http://localhost:3030/ipn",
      shipping_method: "Courier",
      product_name: "Computer.",
      product_category: "Electronic",
      product_profile: "general",
      cus_name: "Customer Name",
      cus_email: order.email,
      cus_add1: order.address,
      cus_add2: "Dhaka",
      cus_city: "Dhaka",
      cus_state: "Dhaka",
      cus_postcode: "1000",
      cus_country: "Bangladesh",
      cus_phone: order.phone,
      cus_fax: "01711111111",
      ship_name: "Customer Name",
      ship_add1: "Dhaka",
      ship_add2: "Dhaka",
      ship_city: "Dhaka",
      ship_state: "Dhaka",
      ship_postcode: 1000,
      ship_country: "Bangladesh",
    };

    console.log(data);

    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
    sslcz.init(data).then((apiResponse: any) => {
      // Redirect the user to payment gateway
      let GatewayPageURL = apiResponse.GatewayPageURL;
      res.send({ url: GatewayPageURL });

      const finalOrder = {
        ...order,
        paidStatus: false,
        tranjectionId: tran_id,
      };

      // console.log(finalOrder)

      const result = orderServices.createOrderIntoDB(finalOrder);

      console.log("Redirecting to: ", GatewayPageURL);
    });

    app.post("/payment/success/:tranId", async (req, res) => {
      console.log(req.params.tranId);
      const result = await Order.updateOne(
        { tranjectionId: req.params.tranId },
        {
          $set: {
            paidStatus: true,
          },
        }
      );
      if (result.modifiedCount > 0) {
        res.redirect(
          `https://book-shop-as.vercel.app/payment/success/${req.params.tranId}`
        );
      }
    });
    app.post("/payment/fail/:tranId", async (req, res) => {
      console.log(req.params.tranId);
      const result = await Order.deleteOne({
        tranjectionId: req.params.tranId,
      });
      if (result.deletedCount > 0) {
        res.redirect(`https://book-shop-as.vercel.app/payment/fail/${req.params.tranId}`);
      }
    });

    // res.status(200).json({
    //   message: "Order Created Successfully",
    //   status: true,
    //   res: result,
    // });
  } catch (error: any) {
    res.status(500).json({
      message: "Something Went Wrong While Taking Order",
      status: false,
      error: error.message,
    });
  }
};

const updateOrder = catchAsync(async (req, res) => {
  const { orderId } = req.params;

  const result = await orderServices.updateOrderIntoDb(orderId);
  res.status(200).json({
    success: true,
    statusCode: 200,
    message: "Orders Updated Successfully",
    data: result,
  });
});

const deleteOrder = catchAsync(async (req, res) => {
  const {orderId} = req.params;
  const result = await orderServices.deleteOrderIntoDb(orderId);
  res.status(200).json({
    success: true,
    statusCode: 200,
    message: "Orders Deleted Successfully",
    data: result,
  });
});

const getRevenue = async (req: Request, res: Response) => {
  try {
    const totalRevenue = await totalRevenueIncome.calculateRevenue();
    res.status(200).json({
      message: "Revenue calculated successfully",
      status: true,
      data: {
        totalRevenue,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      message: "Something went wrong while calculating revenue",
      status: false,
      error: error.message,
    });
  }
};

export const orderController = {
  createOrder,
  getRevenue,
  getAllOrders,
  updateOrder,
  deleteOrder,
};
