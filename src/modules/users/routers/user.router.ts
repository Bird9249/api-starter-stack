import { Hono } from "hono";
import {
  createUser,
  deleteUser,
  getUser,
  getUserById,
  updateUser,
} from "../controllers/user.controller";

const userRouter = new Hono();

userRouter
  .get("/", ...getUser)
  .post("/", ...createUser)
  .get("/:id", ...getUserById)
  .put("/:id", ...updateUser)
  .delete("/:id", ...deleteUser);

export default userRouter;
