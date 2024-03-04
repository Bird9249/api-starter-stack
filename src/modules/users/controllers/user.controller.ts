import { createFactory } from "hono/factory";
import { HTTPException } from "hono/http-exception";
import { validator } from "hono/validator";
import Container from "typedi";
import { parse, parseAsync } from "valibot";
import { GetByIdDto } from "../../../common/dtos/get-by-id.dto";
import { OffsetBasePaginateDto } from "../../../common/dtos/offset-base-paginate.dto";
import authMiddleware from "../../../common/middlewares/auth.middleware";
import permissionMiddleware from "../../../common/middlewares/permission.middleware";
import CreateUserCommand from "../domain/commands/users/create-user.command";
import DeleteUserCommand from "../domain/commands/users/delete-user.command";
import UpdateUserCommand from "../domain/commands/users/update-user.command";
import { CreateUserDto } from "../domain/dtos/users/create-user.dto";
import { UpdateUserDto } from "../domain/dtos/users/update-user.dto";
import {
  PermissionGroup,
  PermissionNames,
} from "../domain/entities/permission.entity";
import GetUserByIdQuery from "../domain/queries/users/get-user-by-id.query";
import GetUserQuery from "../domain/queries/users/get-user.query";
import { GetUserByIdDrizzleRepo } from "../drizzle/user/get-user-by-id.repository";
import { GetUserDrizzleRepo } from "../drizzle/user/get-user.repository";
import CreateUserCase from "../use-cases/users/create-user.case";
import DeleteUserCase from "../use-cases/users/delete-user.case";
import UpdateUserCase from "../use-cases/users/update-user.case";

const factory = createFactory();

const getCase = Container.get(GetUserDrizzleRepo);
export const getUser = factory.createHandlers(
  authMiddleware,
  permissionMiddleware(PermissionNames.Read, PermissionGroup.User),
  validator("query", (value) => parse(OffsetBasePaginateDto, value)),
  async (c) => {
    const query = c.req.valid("query");

    const result = await getCase.execute(new GetUserQuery(query));

    return c.json(result, 200);
  }
);

const createCase = Container.get(CreateUserCase);
export const createUser = factory.createHandlers(
  authMiddleware,
  permissionMiddleware(PermissionNames.Write, PermissionGroup.User),
  validator("form", async (value) => await parseAsync(CreateUserDto, value)),
  async (c) => {
    const body = c.req.valid("form");

    const result = await createCase.execute(new CreateUserCommand(body));

    return c.json({ message: result }, 201);
  }
);

const getByIdCase = Container.get(GetUserByIdDrizzleRepo);
export const getUserById = factory.createHandlers(
  authMiddleware,
  permissionMiddleware(PermissionNames.Read, PermissionGroup.User),
  validator("param", (value) => parse(GetByIdDto, value)),
  async (c) => {
    const { id } = c.req.valid("param");

    const result = await getByIdCase.execute(new GetUserByIdQuery(id));

    if (!result)
      throw new HTTPException(404, { message: "ຜູ້ໃຊ້ນີ້ບໍ່ມີໃນລະບົບ" });

    return c.json(result, 200);
  }
);

const updateCase = Container.get(UpdateUserCase);
export const updateUser = factory.createHandlers(
  authMiddleware,
  permissionMiddleware(PermissionNames.Write, PermissionGroup.User),
  validator("param", (value) => parse(GetByIdDto, value)),
  validator("form", async (value, c) => {
    const { id } = c.req.param();
    const body: any = { ...value };
    body.email = { id: Number(id), value: value.email };

    return await parseAsync(UpdateUserDto, body);
  }),
  async (c) => {
    const { id } = c.req.valid("param");
    const form = c.req.valid("form");

    const result = await updateCase.execute(new UpdateUserCommand(id, form));

    return c.json({ message: result }, 200);
  }
);

const deleteCase = Container.get(DeleteUserCase);
export const deleteUser = factory.createHandlers(
  authMiddleware,
  permissionMiddleware(PermissionNames.Remove, PermissionGroup.User),
  validator("param", (value) => parse(GetByIdDto, value)),
  async (c) => {
    const { id } = c.req.valid("param");

    const result = await deleteCase.execute(new DeleteUserCommand(id));

    return c.json({ message: result }, 200);
  }
);
