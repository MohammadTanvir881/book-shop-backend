import { ErrorRequestHandler } from "express";
import { TErrorSource } from "../Error/interface/error";
import AppError from "../Error/AppError";
import handleCastError from "../Error/HandleCastError";
import handleDuplicateError from "../Error/handleDuplicateError";
import { ZodError } from "zod";
import handleValidationError from "../Error/handleValidationError";
import handleZodError from "../Error/handleZodValidationError";


const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  let statusCode = 400;
  let message = "Validation Error";
  let errorSource: TErrorSource = [
    {
      path: "",
      message: "Something went wrong",
    },
  ];

  if (err instanceof ZodError) {
    const simplifyError = handleZodError(err);
    statusCode = simplifyError.statusCode;
    message = simplifyError.message;
    errorSource = simplifyError.errorSource;
  } else if (err?.name === "ValidationError") {
    const simplifyError = handleValidationError(err);
    statusCode = simplifyError.statusCode;
    message = simplifyError.message;
    errorSource = simplifyError.errorSource;
  } else if (err.name === "CastError") {
    const simplifyError = handleCastError(err);
    statusCode = simplifyError.statusCode;
    message = simplifyError.message;
    errorSource = simplifyError.errorSource;
  } else if (err.code === 11000) {
    const simplifyError = handleDuplicateError(err);
    statusCode = simplifyError.statusCode;
    message = simplifyError.message;
    errorSource = simplifyError.errorSource;
  } else if (err instanceof AppError) {
    statusCode = err?.statusCode;
    message = err?.message;
    errorSource = [
      {
        path: "",
        message: err?.message,
      },
    ];
  } else if (err instanceof Error) {
    message = err?.message;
    errorSource = [
      {
        path: "",
        message: err.message,
      },
    ];
  }

  return res.status(statusCode).json({
    status: false,
    message,
    errorSource,
    err,
    // stack: config.node_env === "development" ? err?.stack : null,
  });
};

export default globalErrorHandler;
