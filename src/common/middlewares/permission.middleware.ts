import { createFactory } from "hono/factory";
import { IPayload } from "../../infrastructure/jwt/generate-jwt.interface";
import {
  PermissionGroup,
  PermissionNames,
} from "../../modules/users/domain/entities/permission.entity";

const factory = createFactory();

export default (name: PermissionNames, group: PermissionGroup) =>
  factory.createMiddleware(async (c, next) => {
    const payload = c.var.jwtPayload as IPayload;

    if (
      payload.roles?.includes("dev") ||
      payload.roles?.includes("admin") ||
      payload.permissions?.includes(`${group}:${name}`)
    ) {
      await next();
    } else {
      return c.json({
        message: "ຫ້າມເຂົ້າເຖິງ. ທ່ານບໍ່ມີສິດໃນການເຂົ້າເຖິງຊັບພະຍາກອນນີ້.",
      });
    }
  });
