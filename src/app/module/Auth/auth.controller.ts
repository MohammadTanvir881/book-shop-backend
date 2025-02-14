import config from "../../config";
import catchAsync from "../utlis/catchAsync";
import { AuthServices } from "./auth.services";

const loginUser = catchAsync(async (req, res) => {
  const result = await AuthServices.loginUser(req.body);
  const { refreshToken } = result;
  console.log(refreshToken)
  res.cookie("refreshToken", refreshToken, {
    secure: config.NODE_ENV === "development",
    httpOnly: true,
    // sameSite: 'none',
    // maxAge: 1000 * 60 * 60 * 24 * 365,
  });
  res.status(200).json({
    success: true,
    message: "User login successfully",
    statusCode: 201,
    data: result,
  });
});

const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;
  console.log(refreshToken)
  const result = await AuthServices.refreshToken(refreshToken);

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: "Access token is retrieved succesfully!",
    data: result,
  });
});

export const AuthController = {
  loginUser,
  refreshToken,
};
