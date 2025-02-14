import bcrypt from "bcrypt";
import { JwtPayload } from "jsonwebtoken";
import AppError from "../../Error/AppError";
import { TUser } from "./user.interface";
import { User } from "./user.model";
import config from "../../config";

const createUserIntoDb = async (payload: TUser) => {
  const result = await User.create(payload);
  return result;
};

const getAllUserFromDb = async () => {
  const result = await User.find();
  return result;
};

const blockUserIntoDb = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(404, "User Not Found");
  }
  const userStatus = user?.isBlocked;

  if (userStatus) {
    throw new AppError(500, "This user is already blocked");
  }

  const result = await User.findByIdAndUpdate(
    userId,
    { isBlocked: true },
    { new: true, runValidators: true }
  );
  return result;
};
const activatedUserIntoDb = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(404, "User Not Found");
  }

  const result = await User.findByIdAndUpdate(
    userId,
    { isBlocked: false },
    { new: true, runValidators: true }
  );
  return result;
};

const makeUserToAdminIntoDb = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(404, "User Not Found");
  }

  const userStatus = user?.isBlocked;

  if (userStatus) {
    throw new AppError(500, "This user is already blocked");
  }

  const result = await User.findByIdAndUpdate(
    userId,
    { role: "admin" },
    { new: true, runValidators: true }
  );
  return result;
};

const makeAdminToUserIntoDb = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(404, "User Not Found");
  }

  const userStatus = user?.isBlocked;

  if (userStatus) {
    throw new AppError(500, "This user is already blocked");
  }

  const result = await User.findByIdAndUpdate(
    userId,
    { role: "user" },
    { new: true, runValidators: true }
  );
  return result;
};

const changePassword = async (
  userData: JwtPayload,
  payload: { oldPassword: string; newPassword: string }
) => {
  console.log("User Data from Backed", userData);
  const user = await User.findOne({ email: userData.userEmail }).select(
    "+password"
  );
  if (!user) {
    throw new AppError(404, "User Not Found");
  }

  const userStatus = user?.isBlocked;

  if (userStatus) {
    throw new AppError(500, "This user is already blocked");
  }

  const hashedPassword = user.password;
  console.log(hashedPassword);
  console.log("Old Password", payload.oldPassword);

  const isPasswordMatched = await bcrypt.compare(
    payload.oldPassword,
    hashedPassword
  );
  if (!isPasswordMatched) {
    throw new AppError(500, "Password Do Not March , Enter a correct Password");
  }
  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_round)
  );

  const result = await User.findOneAndUpdate(
    {
      email: userData.userEmail,
      role: userData.role,
    },
    {
      password: newHashedPassword,
    }
  );
  return result;
};

export const UserServices = {
  createUserIntoDb,
  getAllUserFromDb,
  blockUserIntoDb,
  activatedUserIntoDb,
  makeUserToAdminIntoDb,
  makeAdminToUserIntoDb,
  changePassword,
};
