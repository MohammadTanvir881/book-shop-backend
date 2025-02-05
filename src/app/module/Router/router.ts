import { Router } from "express";
import { booksRoutes } from "../books/books.route";
import orderRouter from "../orders/order.routes";
import { AuthRoute } from "../Auth/auth.route";
import { UserRouter } from "../Users/user.routes";

const router = Router();

const moduleRoutes = [
  {
    path: "/products",
    route: booksRoutes,
  },
  {
    path: "/orders",
    route: orderRouter,
  },
  {
    path: "/auth",
    route: AuthRoute,
  },
  {
    path: "/users",
    route: UserRouter,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
