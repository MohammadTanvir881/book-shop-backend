import bcrypt from "bcrypt";
import AppError from "../../Error/AppError";
import { User } from "../Users/user.model";
import { ILoginUser } from "./auth.interface";
import { createToken, verifyToken } from "./auth.utlis";
import config from "../../config";

const loginUser = async (payload: ILoginUser) => {
  const user = await User.findOne({ email: payload?.email }).select(
    "+password"
  );
  if (!user) {
    throw new AppError(404, "User Not Found");
  }
  // check if the user is blocked deleted
  const isBlocked = user.isBlocked;
  if (isBlocked) {
    throw new AppError(500, "This user is Blocked");
  }

  // check the password
  const isPasswordMatched = await bcrypt.compare(
    payload?.password,
    user?.password
  );

  if (!isPasswordMatched) {
    throw new AppError(500, "Wrong Password");
  }

  // jwt Access Token
  const jwtPayload = {
    userEmail: user?.email,
    role: user?.role,
    _id: user?._id,
  };

  const token = createToken(
    jwtPayload,
    config.access_Token_secret as string,
    config.access_token_expire_in as string
  );

  const refreshToken = createToken(
    jwtPayload,
    config.refresh_Token_secret as string,
    config.refresh_token_expire_in as string
  );

  return {
    token,
    refreshToken,
  };
};

const refreshToken = async (tokenFound: string) => {
  // checking if the given token is valid
  const decoded = verifyToken(
    tokenFound,
    config.refresh_Token_secret as string
  );

  const { userEmail, iat } = decoded;

  const user = await User.findOne({ email: userEmail }).select("+password");
  if (!user) {
    throw new AppError(404, "User Not Found");
  }
  // check if the user is blocked deleted
  const isBlocked = user.isBlocked;
  if (isBlocked) {
    throw new AppError(500, "This user is Blocked");
  }

  const jwtPayload = {
    userEmail: user?.email,
    role: user?.role,
    _id: user?._id,
  };

  const token = createToken(
    jwtPayload,
    config.access_Token_secret as string,
    config.access_token_expire_in as string
  );

  return {
    token,
  };
};

export const AuthServices = {
  loginUser,
  refreshToken,
};
