import { Hono } from "hono";
import { getMe, login, logout, refreshToken } from "../controllers/auth.controller";

const authRouter = new Hono();

authRouter
  .post("/login", ...login)
  .get("/me", ...getMe)
  .post("/refresh-token", ...refreshToken)
  .post("/logout", ...logout)

export default authRouter;
