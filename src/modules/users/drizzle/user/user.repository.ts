import { eq, sql } from "drizzle-orm";
import { Inject, Service } from "typedi";
import { DrizzleConnection } from "../../../../infrastructure/drizzle/connection";
import User from "../../domain/entities/user.entity";
import { IUserRepository } from "../../domain/repositories/users/user.interface";
import { ProfileMapper } from "../mappers/profile.mapper";
import { RoleMapper } from "../mappers/role.mapper";
import { UserMapper } from "../mappers/user.mapper";
import { profiles } from "../schema/profiles";
import { users } from "../schema/users";
import { usersToRoles } from "../schema/users_to_roles";

@Service()
export class UserDrizzleRepo implements IUserRepository {
  private readonly drizzle = DrizzleConnection.getInstance();

  constructor(
    @Inject() private readonly _mapper: UserMapper,
    @Inject() private readonly _profileMapper: ProfileMapper,
    @Inject() private readonly _roleMapper: RoleMapper
  ) {}

  async create(entity: User): Promise<void> {
    const model = this._mapper.toModel(entity);

    await this.drizzle.db.transaction(async (tx) => {
      const userRes = await tx.insert(users).values(model).returning();

      if (entity.profile) {
        entity.profile.user = userRes[0];
        const profileModal = this._profileMapper.toModel(entity.profile);

        await tx.insert(profiles).values(profileModal);
      }

      if (entity.roles && entity.roles.length > 0) {
        await tx.insert(usersToRoles).values(
          entity.roles.map((role) => ({
            role_id: role.id,
            user_id: userRes[0].id,
          }))
        );
      }
    });
  }

  async checkDuplicate(email: string, id?: number): Promise<void | User> {
    let res = await this.drizzle.db.query.users.findFirst({
      where: (fields, { and, eq, not }) =>
        and(eq(fields.email, email), id ? not(eq(fields.id, id)) : undefined),
    });

    if (res) return this._mapper.toEntity(res);
  }

  private _getByIdPrepared = this.drizzle.db.query.users
    .findFirst({
      where: (fields, { eq }) => eq(fields.id, sql.placeholder("id")),
      with: {
        profile: true,
        usersToRoles: { with: { role: true } },
      },
    })
    .prepare("get_user_by_id");
  async getById(id: number): Promise<void | User> {
    let res = await this._getByIdPrepared.execute({ id });

    if (res) {
      const result = this._mapper.toEntity(res);
      result.profile = this._profileMapper.toEntity(res.profile);
      result.roles = res.usersToRoles.map((val) =>
        this._roleMapper.toEntity(val.role)
      );
      return result;
    }
  }

  async update(entity: User): Promise<void> {
    const model = this._mapper.toModel(entity);

    await this.drizzle.db.transaction(async (tx) => {
      await tx.update(users).set(model).where(eq(users.id, model.id));

      if (entity.profile) {
        const profileModal = this._profileMapper.toModel(entity.profile);

        await tx
          .update(profiles)
          .set(profileModal)
          .where(eq(profiles.user_id, model.id));
      }

      if (entity.roles && entity.roles.length > 0) {
        await tx.delete(usersToRoles).where(eq(usersToRoles.user_id, model.id));

        await tx.insert(usersToRoles).values(
          entity.roles.map((role) => ({
            user_id: model.id,
            role_id: role.id,
          }))
        );
      }
    });
  }

  async remove(id: number): Promise<void> {
    await this.drizzle.db.delete(users).where(eq(users.id, id));
  }
}
