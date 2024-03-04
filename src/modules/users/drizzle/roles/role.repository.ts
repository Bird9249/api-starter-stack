import { eq, inArray, sql } from "drizzle-orm";
import { Inject, Service } from "typedi";
import { DrizzleConnection } from "../../../../infrastructure/drizzle/connection";
import Role from "../../domain/entities/role.entity";
import { IRoleRepository } from "../../domain/repositories/roles/role.interface";
import { RoleMapper } from "../mappers/role.mapper";
import { roles } from "../schema/roles";
import { rolesToPermissions } from "../schema/roles_to_permissions";

@Service()
export class RoleDrizzleRepo implements IRoleRepository {
  private readonly drizzle = DrizzleConnection.getInstance();

  constructor(@Inject() private readonly _mapper: RoleMapper) {}

  async create(entity: Role): Promise<void> {
    const model = this._mapper.toModel(entity);

    await this.drizzle.db.transaction(async (tx) => {
      const roleRes = await tx.insert(roles).values(model).returning();

      if (entity.permissions) {
        await tx.insert(rolesToPermissions).values(
          entity.permissions.map((per) => ({
            role_id: roleRes[0].id,
            permission_id: per.id,
          }))
        );
      }
    });
  }

  private _preparedGetById = this.drizzle.db.query.roles
    .findFirst({
      where: (fields, { eq }) => eq(fields.id, sql.placeholder("id")),
    })
    .prepare("get_role_by_id");
  async getById(id: number): Promise<void | Role> {
    const res = await this._preparedGetById.execute({ id });

    if (res) return this._mapper.toEntity(res);
  }

  async update(entity: Role): Promise<void> {
    const roleModal = this._mapper.toModel(entity);

    await this.drizzle.db.transaction(async (tx) => {
      const roleRes = await tx
        .update(roles)
        .set(roleModal)
        .where(eq(roles.id, entity.id))
        .returning();

      if (entity.permissions) {
        await tx
          .delete(rolesToPermissions)
          .where(eq(rolesToPermissions.role_id, roleRes[0].id));

        await tx.insert(rolesToPermissions).values(
          entity.permissions.map((val) => ({
            role_id: roleRes[0].id,
            permission_id: val.id,
          }))
        );
      }
    });
  }

  async remove(id: number): Promise<void> {
    await this.drizzle.db.delete(roles).where(eq(roles.id, id));
  }

  async checkIdsIsExist(ids: number[]): Promise<Role[]> {
    const result = await this.drizzle.db
      .select()
      .from(roles)
      .where(inArray(roles.id, ids));

    return result.map((val) => this._mapper.toEntity(val));
  }
}
