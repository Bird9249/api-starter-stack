import { count, eq } from "drizzle-orm";
import { IPaginated } from "../../../../common/interfaces/pagination/paginated.interface";
import { DrizzleConnection } from "../../../../infrastructure/drizzle/connection";
import Role from "../../domain/entities/role.entity";
import GetRoleQuery from "../../domain/queries/roles/get-role.query";
import IGetRoleRepository from "../../domain/repositories/roles/get-role.interface";
import { RoleMapper } from "../mappers/role.mapper";
import { roles } from "../schema/roles";

export class GetRoleDrizzleRepo implements IGetRoleRepository {
  private readonly drizzle = DrizzleConnection.getInstance();
  private readonly _mapper = RoleMapper.getInstance();

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

  private static instance: GetRoleDrizzleRepo;
  public static getInstance(): GetRoleDrizzleRepo {
    if (!GetRoleDrizzleRepo.instance) {
      GetRoleDrizzleRepo.instance = new GetRoleDrizzleRepo();
    }

    return GetRoleDrizzleRepo.instance;
  }
}
