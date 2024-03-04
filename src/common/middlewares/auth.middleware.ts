import { createFactory } from "hono/factory";
import { JwtTokenExpired, JwtTokenInvalid } from "hono/utils/jwt/types";
import Container from "typedi";
import { HonoGenerateJwtService } from "../../infrastructure/jwt/hono/hono-generate-jwt.service";
import RemoveSessionCommand from "../../modules/users/domain/commands/auth/remove-session.command";
import { AuthDrizzleRepo } from "../../modules/users/drizzle/auth/auth.repository";
import RemoveSessionCase from "../../modules/users/use-cases/auth/remove-session.case";
import { JwtErrorCode } from "../enum/jwt-error-code.enum";

const factory = createFactory();
const jwt = Container.get(HonoGenerateJwtService);
const removeSessionCase = Container.get(RemoveSessionCase);
const repository = Container.get(AuthDrizzleRepo);

export default factory.createMiddleware(async ({ req, json, set }, next) => {
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
    const payload = await jwt.verify(token);

    const session = await repository.getSession(payload.token_id);

    if (!session)
      return json(
        {
          message: "ບໍ່ມີການເຂົ້າສູລະບົບ ກະລຸນາເຂົ້າສູ່ລະບົບກ່ອນ.",
        },
        401
      );

    set("jwtPayload", payload);

    await next();
  } catch (error) {
    switch (true) {
      case error instanceof JwtTokenInvalid:
        return json(
          {
            message: "ໂທເຄັນ JWT ບໍ່ຖືກຕ້ອງ.",
            code: JwtErrorCode.InvalidToken,
          },
          401
        );

      case error instanceof JwtTokenExpired:
        const payload = jwt.decode(token);

        await removeSessionCase.execute(
          new RemoveSessionCommand(payload.token_id)
        );

        return json(
          { message: "JWT token ໝົດອາຍຸ.", code: JwtErrorCode.TokenExpired },
          401
        );
      default:
        console.log(error);

        return json(
          {
            message: "ເກີດຄວາມຜິດພາດທີ່ບໍ່ຄາດຄິດ",
            code: JwtErrorCode.InvalidToken,
          },
          401
        );
    }
  }
});
