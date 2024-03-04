import { createFactory } from "hono/factory";
import { validator } from "hono/validator";
import Container from "typedi";
import { parse, parseAsync } from "valibot";
import { GetByIdDto } from "../../../common/dtos/get-by-id.dto";
import { OffsetBasePaginateDto } from "../../../common/dtos/offset-base-paginate.dto";
import authMiddleware from "../../../common/middlewares/auth.middleware";
import permissionMiddleware from "../../../common/middlewares/permission.middleware";
import CreateRoleCommand from "../domain/commands/roles/create-role.command";
import DeleteRoleCommand from "../domain/commands/roles/delete-role.command";
import UpdateRoleCommand from "../domain/commands/roles/update-role.command";
import { CreateRoleDto } from "../domain/dtos/roles/create-role.dto";
import { UpdateRoleDto } from "../domain/dtos/roles/update-role.dto";
import {
  PermissionGroup,
  PermissionNames,
} from "../domain/entities/permission.entity";
import GetRoleByIdQuery from "../domain/queries/roles/get-role-by-id.query";
import GetRoleQuery from "../domain/queries/roles/get-role.query";
import { GetRoleByIdDrizzleRepo } from "../drizzle/roles/get-role-by-id.repository";
import { GetRoleDrizzleRepo } from "../drizzle/roles/get-role.repository";
import CreateRoleCase from "../use-cases/roles/create-role.case";
import DeleteRoleCase from "../use-cases/roles/delete-role.case";
import UpdateRoleCase from "../use-cases/roles/update-role.case";

const factory = createFactory();

const getRolesCase = Container.get(GetRoleDrizzleRepo);
export const getRoles = factory.createHandlers(
  authMiddleware,
  permissionMiddleware(PermissionNames.Read, PermissionGroup.User),
  validator("query", (value) => parse(OffsetBasePaginateDto, value)),
  async (c) => {
    const query = c.req.valid("query");

    const result = await getRolesCase.execute(new GetRoleQuery(query));

    return c.json(result, 200);
  }
);

const createCase = Container.get(CreateRoleCase);
export const createRole = factory.createHandlers(
  authMiddleware,
  permissionMiddleware(PermissionNames.Write, PermissionGroup.User),
  validator("json", async (value) => await parseAsync(CreateRoleDto, value)),
  async (c) => {
    const body = c.req.valid("json");

    const result = await createCase.execute(new CreateRoleCommand(body));

    return c.json({ message: result }, 200);
  }
);

const getByIdCase = Container.get(GetRoleByIdDrizzleRepo);
export const getRoleById = factory.createHandlers(
  authMiddleware,
  permissionMiddleware(PermissionNames.Read, PermissionGroup.User),
  validator("param", (value) => parse(GetByIdDto, value)),
  async (c) => {
    const { id } = c.req.valid("param");

    const result = await getByIdCase.execute(new GetRoleByIdQuery(id));

    return c.json(result, 200);
  }
);

const updateCase = Container.get(UpdateRoleCase);
export const updateRole = factory.createHandlers(
  authMiddleware,
  permissionMiddleware(PermissionNames.Write, PermissionGroup.User),
  validator("param", (value) => parse(GetByIdDto, value)),
  validator("json", async (value) => await parseAsync(UpdateRoleDto, value)),
  async (c) => {
    const { id } = c.req.valid("param");
    const body = c.req.valid("json");

    const result = await updateCase.execute(new UpdateRoleCommand(id, body));

    return c.json({ message: result }, 200);
  }
);

const deleteCase = Container.get(DeleteRoleCase);
export const deleteRole = factory.createHandlers(
  authMiddleware,
  permissionMiddleware(PermissionNames.Remove, PermissionGroup.User),
  validator("param", (value) => parse(GetByIdDto, value)),
  async (c) => {
    const { id } = c.req.valid("param");

    const result = await deleteCase.execute(new DeleteRoleCommand(id));

    return c.json({ message: result }, 200);
  }
);
