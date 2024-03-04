import { inArray } from "drizzle-orm";
import { Inject, Service } from "typedi";
import { DrizzleConnection } from "../../../../infrastructure/drizzle/connection";
import Permission from "../../domain/entities/permission.entity";
import { IPermissionRepository } from "../../domain/repositories/permissions/permission.interface";
import { PermissionMapper } from "../mappers/permission.mapper";
import { permissions } from "../schema/permissions";

@Service()
export class PermissionDrizzleRepo implements IPermissionRepository {
  private readonly drizzle = DrizzleConnection.getInstance();

  constructor(@Inject() private readonly _mapper: PermissionMapper) {}

  async checkIdsIsExist(ids: number[]): Promise<Permission[]> {
    const result = await this.drizzle.db
      .select()
      .from(permissions)
      .where(inArray(permissions.id, ids));

    return result.map((val) => this._mapper.toEntity(val));
  }
}
