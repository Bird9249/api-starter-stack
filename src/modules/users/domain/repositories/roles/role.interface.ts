import Role from "../../entities/role.entity";

export interface IRoleRepository {
  create(entity: Role): Promise<void>;

  getById(id: number): Promise<Role | void>

  update(entity: Role): Promise<void>;

  remove(id: number): Promise<void>;

  checkIdsIsExist(ids: number[]): Promise<Role[]>
}
