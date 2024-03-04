import { DrizzleConnection } from "../../../../infrastructure/drizzle/connection";
import Permission from "../../domain/entities/permission.entity";
import IGetPermissionRepository from "../../domain/repositories/permissions/get-permission.interface";
import { PermissionMapper } from "../mappers/permission.mapper";
import { permissions } from "../schema/permissions";

export class GetPermissionDrizzleRepo implements IGetPermissionRepository {
  private readonly drizzle = DrizzleConnection.getInstance();
  private readonly _mapper = PermissionMapper.getInstance();

  private _prepared = this.drizzle.db
    .select()
    .from(permissions)
    .prepare("get_permission");
  async execute(): Promise<Permission[]> {
    const res = await this._prepared.execute();

    return res.map((val) => this._mapper.toEntity(val));
  }

  private static instance: GetPermissionDrizzleRepo;
  public static getInstance(): GetPermissionDrizzleRepo {
    if (!GetPermissionDrizzleRepo.instance) {
      GetPermissionDrizzleRepo.instance = new GetPermissionDrizzleRepo();
    }

    return GetPermissionDrizzleRepo.instance;
  }
}
