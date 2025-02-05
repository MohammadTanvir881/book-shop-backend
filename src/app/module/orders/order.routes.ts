import express from "express";
import { orderController } from "./order.controller";
import validateRequest from "../utlis/validateRequest";
import { OrderValidation } from "./order.zodValidation";


const orderRouter = express.Router();

orderRouter.post("/",validateRequest(OrderValidation.orderValidationSchema), orderController.createOrder);
orderRouter.get("/revenue" , orderController.getRevenue)


export default orderRouter;
