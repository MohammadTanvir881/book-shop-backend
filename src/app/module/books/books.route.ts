import express, { NextFunction, Request, Response } from "express";
import { booksController } from "./books.controller";
import validateRequest from "../utlis/validateRequest";
import booksZodValidationSchema from "./books.zodValidation";
import auth from "../Auth/auth";
import { upload } from "../utlis/sendImageToCloudinary";

const router = express.Router();

router.post(
  "/",
  auth("admin"),
  upload.single("file"),
  (req : Request , res : Response , next : NextFunction)=>{
     req.body = JSON.parse(req.body.data);
     next()
  },
    validateRequest(booksZodValidationSchema),
  booksController.createBookData
);
router.get("/", booksController.getBooksData);
router.get("/:productId", booksController.getSingleBookData);
router.put("/:productId", auth("admin"), booksController.updateBookData);
router.delete("/:productId", auth("admin"), booksController.deleteBookData);

export const booksRoutes = router;
