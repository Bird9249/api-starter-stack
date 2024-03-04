import { sql } from "drizzle-orm";
import { Inject, Service } from "typedi";
import { DrizzleConnection } from "../../../../infrastructure/drizzle/connection";
import GetUserByIdQuery from "../../domain/queries/users/get-user-by-id.query";
import IGetUserByIdRepository, {
  GetUserByIdResult,
} from "../../domain/repositories/users/get-user-by-id.interface";
import { ProfileMapper } from "../mappers/profile.mapper";
import { RoleMapper } from "../mappers/role.mapper";
import { SessionMapper } from "../mappers/session.mapper";
import { UserMapper } from "../mappers/user.mapper";

@Service()
export class GetUserByIdDrizzleRepo implements IGetUserByIdRepository {
  private readonly drizzle = DrizzleConnection.getInstance();

  constructor(
    @Inject() private readonly _mapper: UserMapper,
    @Inject() private readonly _profileMapper: ProfileMapper,
    @Inject() private readonly _roleMapper: RoleMapper,
    @Inject() private readonly _sessionMapper: SessionMapper
  ) {}

  private _prepared = this.drizzle.db.query.users
    .findFirst({
      columns: { password: false },
      where: (fields, { eq }) => eq(fields.id, sql.placeholder("id")),
      with: {
        profile: true,
        sessions: true,
        usersToRoles: {
          with: {
            role: {
              with: {
                rolesToPermissions: {
                  with: {
                    permission: true,
                  },
                },
              },
            },
          },
        },
      },
    })
    .prepare("get_user_by_id");
  async execute({ id }: GetUserByIdQuery): Promise<GetUserByIdResult> {
    const res = await this._prepared.execute({ id });

    if (!res) return;

    const permissions: string[] = [];

    if (res.usersToRoles)
      res.usersToRoles.forEach(({ role: { rolesToPermissions } }) => {
        if (rolesToPermissions)
          rolesToPermissions.forEach(({ permission: { name } }) => {
            if (!permissions.includes(name)) permissions.push(name);
          });
      });

    return {
      ...this._mapper.toEntity(res),
      profile: res.profile
        ? this._profileMapper.toEntity(res.profile)
        : undefined,
      roles: res.usersToRoles.map(({ role }) =>
        this._roleMapper.toEntity(role)
      ),
      permissions,
      session: res.sessions.map((ses) => this._sessionMapper.toEntity(ses))[0],
    };
  }
}
