import { createFactory } from "hono/factory";
import { validator } from "hono/validator";
import Container from "typedi";
import { parse } from "valibot";
import authMiddleware from "../../../common/middlewares/auth.middleware";
import refreshTokenMiddleware from "../../../common/middlewares/refresh-token.middleware";
import { IPayload } from "../../../infrastructure/jwt/generate-jwt.interface";
import LoginCommand from "../domain/commands/auth/login.command";
import LogoutCommand from "../domain/commands/auth/logout.command";
import RefreshTokenCommand from "../domain/commands/auth/refresh-token.command";
import { LoginDto } from "../domain/dtos/auth/login.dto";
import GetUserByIdQuery from "../domain/queries/users/get-user-by-id.query";
import { GetUserByIdDrizzleRepo } from "../drizzle/user/get-user-by-id.repository";
import LoginCase from "../use-cases/auth/login.case";
import LogoutCase from "../use-cases/auth/logout.case";
import RefreshTokenCase from "../use-cases/auth/refresh-token.case";

const factory = createFactory();

const loginCase = Container.get(LoginCase);
export const login = factory.createHandlers(
  validator("json", (value) => parse(LoginDto, value)),
  async (c) => {
    const body = c.req.valid("json");

    const result = await loginCase.execute(new LoginCommand(body));

    return c.json(result, 200);
  }
);

const refreshTokenCase = Container.get(RefreshTokenCase);
export const refreshToken = factory.createHandlers(
  refreshTokenMiddleware,
  async (c) => {
    const token = (c.req.header("Authorization") as string).split(" ")[1];

    const result = await refreshTokenCase.execute(
      new RefreshTokenCommand(token)
    );

    return c.json({ message: result }, 200);
  }
);

const getUserByIdCase = Container.get(GetUserByIdDrizzleRepo);
export const getMe = factory.createHandlers(authMiddleware, async (c) => {
  const { sub } = c.var.jwtPayload as IPayload;

  const result = await getUserByIdCase.execute(
    new GetUserByIdQuery(Number(sub))
  );

  return c.json({ ...result }, 200);
});

const logoutCase = Container.get(LogoutCase);
export const logout = factory.createHandlers(authMiddleware, async (c) => {
  const token = (c.req.header("Authorization") as string).split(" ")[1];

  const result = await logoutCase.execute(new LogoutCommand(token));

  return c.json({ message: result }, 200);
});
