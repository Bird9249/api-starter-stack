import Permission from "../../entities/permission.entity";
import Role from "../../entities/role.entity";

export interface IPermissionRepository {
  checkIdsIsExist(ids: number[]): Promise<Permission[]>;
}
