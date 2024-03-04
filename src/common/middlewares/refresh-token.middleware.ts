import { createFactory } from "hono/factory";
import { JwtTokenExpired, JwtTokenInvalid } from "hono/utils/jwt/types";
import Container from "typedi";
import { HonoGenerateJwtService } from "../../infrastructure/jwt/hono/hono-generate-jwt.service";
import { JwtErrorCode } from "../enum/jwt-error-code.enum";

const factory = createFactory();
const jwt = Container.get(HonoGenerateJwtService);

export default factory.createMiddleware(async ({ req, json }, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader)
    return json(
      {
        message: "ບໍ່ມີ Authorization header.",
        code: JwtErrorCode.MissingToken,
      },
      401
    );

  const token = authHeader.split(" ")[1];

  if (!token)
    return json(
      {
        message: "ຮູບແບບຂອງ Authorization header ບໍ່ຖືກຕ້ອງ.",
        code: JwtErrorCode.InvalidTokenFormat,
      },
      401
    );

  try {
    await jwt.verify(token);

    await next();
  } catch (error) {
    switch (true) {
      case error instanceof JwtTokenInvalid:
        return json(
          {
            message: "ໂທເຄັນ JWT ບໍ່ຖືກຕ້ອງ.",
          },
          401
        );

      case error instanceof JwtTokenExpired:
        return json({ message: "JWT token ໝົດອາຍຸ." }, 401);
      default:
        return json(
          {
            message: "ເກີດຄວາມຜິດພາດທີ່ບໍ່ຄາດຄິດ.",
          },
          401
        );
    }
  }
});
