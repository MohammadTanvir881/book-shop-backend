import express from "express";
import { orderController } from "./order.controller";
import validateRequest from "../utlis/validateRequest";
import { OrderValidation } from "./order.zodValidation";
import auth from "../Auth/auth";

const orderRouter = express.Router();
orderRouter.get("/", orderController.getAllOrders);
orderRouter.post(
  "/",
  validateRequest(OrderValidation.orderValidationSchema),
  orderController.createOrder
);

orderRouter.post("/success/:transId", orderController.paymentSuccess);
// payment fail route
orderRouter.post("/fail/:transId", orderController.paymentFail);

orderRouter.get("/revenue", orderController.getRevenue);
orderRouter.patch(
  "/updateOrder/:orderId",
  auth("admin"),
  orderController.updateOrder
);
orderRouter.delete(
  "/orderDelete/:orderId",
  auth("admin"),
  orderController.deleteOrder
);

export default orderRouter;
