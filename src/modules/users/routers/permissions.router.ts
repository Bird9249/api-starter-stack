import { Hono } from "hono";
import { getPermission } from "../controllers/permissions.controller";

const permissionRouter = new Hono();

permissionRouter.get("/", ...getPermission);

export default permissionRouter;
