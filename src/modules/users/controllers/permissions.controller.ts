import { createFactory } from "hono/factory";
import authMiddleware from "../../../common/middlewares/auth.middleware";
import permissionMiddleware from "../../../common/middlewares/permission.middleware";
import {
  PermissionGroup,
  PermissionNames,
} from "../domain/entities/permission.entity";
import { GetPermissionDrizzleRepo } from "../drizzle/permissions/get-permission.repository";

const factory = createFactory();

const getPermissionCase = GetPermissionDrizzleRepo.getInstance();
export const getPermission = factory.createHandlers(
  authMiddleware,
  permissionMiddleware(PermissionNames.Read, PermissionGroup.User),
  async (c) => {
    const result = await getPermissionCase.execute();

    return c.json(result, 200);
  }
);
