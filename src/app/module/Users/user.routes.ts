import { Router } from "express";
import { UserController } from "./user.controller";
import auth from "../Auth/auth";
import validateRequest from "../utlis/validateRequest";
import { userValidation } from "./user.validation";

const route = Router();

route.get("/", auth("admin", "user"), UserController.getAllUser);
route.post("/changePassword" , auth("admin" , "user") , validateRequest(userValidation.changePasswordValidationSchema) , UserController.changePassword )
route.patch("/block/:userId", auth("admin"), UserController.blockUser);
route.patch("/active/:userId", auth("admin"), UserController.activeUser);
route.patch("/makeAdmin/:userId" , auth("admin") , UserController.makeUserToAdmin)
route.patch("/makeUser/:userId" , auth("admin") , UserController.makeAdminToUser)

export const UserRouter = route;
