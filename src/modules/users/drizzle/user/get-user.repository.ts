import { count } from "drizzle-orm";
import { Inject, Service } from "typedi";
import { DrizzleConnection } from "../../../../infrastructure/drizzle/connection";
import GetUserQuery from "../../domain/queries/users/get-user.query";
import IGetUserRepository, {
  GetUsersResult,
} from "../../domain/repositories/users/get-user.interface";
import { ProfileMapper } from "../mappers/profile.mapper";
import { RoleMapper } from "../mappers/role.mapper";
import { SessionMapper } from "../mappers/session.mapper";
import { UserMapper } from "../mappers/user.mapper";
import { users } from "../schema/users";

@Service()
export class GetUserDrizzleRepo implements IGetUserRepository {
  private readonly drizzle = DrizzleConnection.getInstance();

  constructor(
    @Inject() private readonly _mapper: UserMapper,
    @Inject() private readonly _profileMapper: ProfileMapper,
    @Inject() private readonly _roleMapper: RoleMapper,
    @Inject() private readonly _sessionMapper: SessionMapper
  ) {}

  private _prepared = this.drizzle.db
    .select({ value: count() })
    .from(users)
    .prepare("count_users");
  async execute({
    paginate: { offset, limit },
  }: GetUserQuery): Promise<GetUsersResult> {
    const res = await this.drizzle.db.query.users.findMany({
      with: {
        profile: true,
        sessions: {
          orderBy: (fields, { desc }) => [desc(fields.created_at)],
          limit: 1,
        },
        usersToRoles: { with: { role: true } },
      },
      limit,
      offset,
    });
    const total = await this._prepared.execute();

    return {
      data: res.map((val) => ({
        ...this._mapper.toEntity(val),
        profile: this._profileMapper.toEntity(val.profile),
        roles: val.usersToRoles.map(({ role }) =>
          this._roleMapper.toEntity(role)
        ),
        session: val.sessions.map((ses) =>
          this._sessionMapper.toEntity(ses)
        )[0],
      })),
      total: total[0].value,
    };
  }
}
