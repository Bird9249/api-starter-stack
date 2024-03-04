import { inArray } from "drizzle-orm";
import { DrizzleConnection } from "../../../../infrastructure/drizzle/connection";
import Permission from "../../domain/entities/permission.entity";
import { IPermissionRepository } from "../../domain/repositories/permissions/permission.interface";
import { PermissionMapper } from "../mappers/permission.mapper";
import { permissions } from "../schema/permissions";

export class PermissionDrizzleRepo implements IPermissionRepository {
  private readonly drizzle = DrizzleConnection.getInstance();
  private readonly _mapper = PermissionMapper.getInstance();

  async checkIdsIsExist(ids: number[]): Promise<Permission[]> {
    const result = await this.drizzle.db
      .select()
      .from(permissions)
      .where(inArray(permissions.id, ids));

    return result.map((val) => this._mapper.toEntity(val));
  }

  private static instance: PermissionDrizzleRepo;
  public static getInstance(): PermissionDrizzleRepo {
    if (!PermissionDrizzleRepo.instance) {
      PermissionDrizzleRepo.instance = new PermissionDrizzleRepo();
    }

    return PermissionDrizzleRepo.instance;
  }
}
