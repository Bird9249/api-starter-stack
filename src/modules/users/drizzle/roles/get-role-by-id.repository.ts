import { sql } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";
import { DrizzleConnection } from "../../../../infrastructure/drizzle/connection";
import Role from "../../domain/entities/role.entity";
import GetRoleByIdQuery from "../../domain/queries/roles/get-role-by-id.query";
import IGetRoleByIdRepository from "../../domain/repositories/roles/get-role-by-id.interface";
import { PermissionMapper } from "../mappers/permission.mapper";
import { RoleMapper } from "../mappers/role.mapper";
import { UserMapper } from "../mappers/user.mapper";

export class GetRoleByIdDrizzleRepo implements IGetRoleByIdRepository {
  private readonly drizzle = DrizzleConnection.getInstance();
  private readonly _mapper = RoleMapper.getInstance();
  private readonly _userMapper = UserMapper.getInstance();
  private readonly _permissionMapper = PermissionMapper.getInstance();

  private _prepared = this.drizzle.db.query.roles
    .findFirst({
      where: (fields, { eq }) => eq(fields.id, sql.placeholder("id")),
      columns: { is_default: false },
      with: {
        rolesToPermissions: { with: { permission: true } },
        usersToRoles: { with: { user: { columns: { password: false } } } },
      },
    })
    .prepare("get_role_by_id");

  async execute({ id }: GetRoleByIdQuery): Promise<Role> {
    const res = await this._prepared.execute({ id });

    if (!res)
      throw new HTTPException(404, { message: "ຂໍ້ມູນບົດບາດນີ້ບໍ່​ມີໃນລະບົບ" });

    return {
      ...this._mapper.toEntity(res),
      permissions: res.rolesToPermissions.map((val) =>
        this._permissionMapper.toEntity(val.permission)
      ),
      users: res.usersToRoles.map((val) => this._userMapper.toEntity(val.user)),
    };
  }

  private static instance: GetRoleByIdDrizzleRepo;
  public static getInstance(): GetRoleByIdDrizzleRepo {
    if (!GetRoleByIdDrizzleRepo.instance) {
      GetRoleByIdDrizzleRepo.instance = new GetRoleByIdDrizzleRepo();
    }

    return GetRoleByIdDrizzleRepo.instance;
  }
}
