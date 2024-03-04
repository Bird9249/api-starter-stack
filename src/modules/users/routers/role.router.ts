import { Hono } from "hono";
import {
  createRole,
  deleteRole,
  getRoleById,
  getRoles,
  updateRole,
} from "../controllers/role.controller";

const roleRouter = new Hono();

roleRouter
  .get("/", ...getRoles)
  .post("/", ...createRole)
  .get("/:id", ...getRoleById)
  .put("/:id", ...updateRole)
  .delete("/:id", ...deleteRole);

export default roleRouter;
