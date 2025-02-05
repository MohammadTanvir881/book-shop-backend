import mongoose from "mongoose";
import { TErrorSource, TGenericErrorResponse } from "./interface/error";

const handleCastError = (
  err: mongoose.Error.CastError
): TGenericErrorResponse => {
  const errorSource: TErrorSource = [
    {
      path: err.path,
      message: err.message,
    },
  ];
  const statusCode = 400;
  return {
    errorSource,
    statusCode,
    message : "Invalid Id"
  }
};

export default handleCastError
