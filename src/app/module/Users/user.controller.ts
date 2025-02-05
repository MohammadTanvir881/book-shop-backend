import catchAsync from "../utlis/catchAsync";
import { UserServices } from "./user.services";

const createUser = catchAsync(async (req, res) => {
  const result = await UserServices.createUserIntoDb(req.body);
  const { name, email, _id } = result;
  res.status(200).json({
    success: true,
    message: "User registered successfully",
    statusCode: 201,
    data: {
      _id,
      name,
      email,
    },
  });
});

const getAllUser = catchAsync(async (req, res) => {
  const result = await UserServices.getAllUserFromDb();
  res.status(200).json({
    success: true,
    statusCode: 200,
    message: "User Retrieved Successfully",
    data: result,
  });
});

const blockUser = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const result = await UserServices.blockUserIntoDb(userId);
  res.status(200).json({
    success: true,
    message: "User Blocked successfully",
    statusCode: 200,
  });
});
const activeUser = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const result = await UserServices.activatedUserIntoDb(userId);
  res.status(200).json({
    success: true,
    message: "User Activated successfully",
    statusCode: 200,
  });
});

const makeUserToAdmin = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const result = await UserServices.makeUserToAdminIntoDb(userId);
  res.status(200).json({
    success: true,
    message: "User Updated To Admin successfully",
    statusCode: 200,
  });
});
const makeAdminToUser = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const result = await UserServices.makeAdminToUserIntoDb(userId);
  res.status(200).json({
    success: true,
    message: "Admin Updated To user successfully",
    statusCode: 200,
  });
});
const changePassword = catchAsync(async (req, res) => {
  const { ...passwordData } = req.body;
  
  console.log(passwordData);
  const result = await UserServices.changePassword(req.user, passwordData);
  res.status(200).json({
    success: true,
    message: "Password Changed Successfully",
    statusCode: 200,
  });
});

export const UserController = {
  createUser,
  getAllUser,
  blockUser,
  activeUser,
  makeUserToAdmin,
  makeAdminToUser,
  changePassword,
};
