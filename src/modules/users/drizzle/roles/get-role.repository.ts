import { count, eq } from "drizzle-orm";
import { Inject, Service } from "typedi";
import { IPaginated } from "../../../../common/interfaces/pagination/paginated.interface";
import { DrizzleConnection } from "../../../../infrastructure/drizzle/connection";
import Role from "../../domain/entities/role.entity";
import GetRoleQuery from "../../domain/queries/roles/get-role.query";
import IGetRoleRepository from "../../domain/repositories/roles/get-role.interface";
import { RoleMapper } from "../mappers/role.mapper";
import { roles } from "../schema/roles";

@Service()
export class GetRoleDrizzleRepo implements IGetRoleRepository {
  private readonly drizzle = DrizzleConnection.getInstance();

  constructor(@Inject() private readonly _mapper: RoleMapper) {}

  private _getCount = this.drizzle.db
    .select({ value: count() })
    .from(roles)
    .where(eq(roles.is_default, false))
    .prepare("count_roles");

  async execute({
    paginate: { offset, limit },
  }: GetRoleQuery): Promise<IPaginated<Role>> {
    const res = await this.drizzle.db.query.roles.findMany({
      limit,
      offset,
      where: (fields, { eq }) => eq(fields.is_default, false),
    });
    const total = await this._getCount.execute();

    return {
      data: res.map((val) => this._mapper.toEntity(val)),
      total: total[0].value,
    };
  }
}
