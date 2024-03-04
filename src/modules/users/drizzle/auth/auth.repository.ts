import { eq, sql } from "drizzle-orm";
import { DrizzleConnection } from "../../../../infrastructure/drizzle/connection";
import Session from "../../domain/entities/session.entity";
import User from "../../domain/entities/user.entity";
import IAuthRepository from "../../domain/repositories/auth/auth.interface";
import { PermissionMapper } from "../mappers/permission.mapper";
import { ProfileMapper } from "../mappers/profile.mapper";
import { RoleMapper } from "../mappers/role.mapper";
import { SessionMapper } from "../mappers/session.mapper";
import { UserMapper } from "../mappers/user.mapper";
import { sessions } from "../schema/sessions";

export class AuthDrizzleRepo implements IAuthRepository {
  private readonly drizzle = DrizzleConnection.getInstance();
  private readonly _mapper = SessionMapper.getInstance();
  private readonly _userMapper = UserMapper.getInstance();
  private readonly _profileMapper = ProfileMapper.getInstance();
  private readonly _roleMapper = RoleMapper.getInstance();
  private readonly _permissionMapper = PermissionMapper.getInstance();

  private _checkUserPrepared = this.drizzle.db.query.users
    .findFirst({
      with: {
        profile: true,
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
      where: (fields, { eq }) => eq(fields.email, sql.placeholder("email")),
    })
    .prepare("check_user");
  async checkUser(email: string): Promise<User | void> {
    const res = await this._checkUserPrepared.execute({ email });

    if (res)
      return {
        ...this._userMapper.toEntity(res),
        profile: this._profileMapper.toEntity(res.profile),
        roles: res.usersToRoles.map(({ role }) => ({
          ...this._roleMapper.toEntity(role),
          permissions: role?.rolesToPermissions.map(({ permission }) =>
            this._permissionMapper.toEntity(permission)
          ),
        })),
      };
  }

  async createSession(session: Session): Promise<void> {
    const model = this._mapper.toModel(session);

    await this.drizzle.db.insert(sessions).values(model);
  }

  private _getPrepared = this.drizzle.db.query.sessions
    .findFirst({
      where: (fields, { eq }) => eq(fields.id, sql.placeholder("id")),
    })
    .prepare("get_session");
  async getSession(id: string): Promise<Session | void> {
    const query = await this._getPrepared.execute({ id });

    if (query) return this._mapper.toEntity(query);
  }

  async removeSession(id: string): Promise<void> {
    await this.drizzle.db.delete(sessions).where(eq(sessions.id, id));
  }

  private static instance: AuthDrizzleRepo;
  public static getInstance(): AuthDrizzleRepo {
    if (!AuthDrizzleRepo.instance) {
      AuthDrizzleRepo.instance = new AuthDrizzleRepo();
    }

    return AuthDrizzleRepo.instance;
  }
}
