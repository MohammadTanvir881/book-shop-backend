import express, { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const SSLCommerzPayment = require("sslcommerz-lts");

import router from "./app/module/Router/router";
import globalErrorHandler from "./app/middleWare/globalErrorHandler";
import config from "./app/config";
const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "https://book-shop-five-xi.vercel.app"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use("/api", router);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello");
});

app.use(globalErrorHandler);

export default app;
