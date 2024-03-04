import { Service } from "typedi";
import Role from "../../domain/entities/role.entity";
import { InsertRoleSchema, RoleSchema } from "../schema/roles";

@Service()
export class RoleMapper {
  toModel(entity: Role): InsertRoleSchema {
    return {
      id: entity.id,
      name: entity.name,
      description: entity.description,
      created_at: entity.created_at,
      updated_at: entity.updated_at,
    };
  }

  toEntity(
    model: Omit<RoleSchema, "is_default"> & { is_default?: boolean }
  ): Role {
    const entity = new Role();
    entity.id = model.id;
    entity.name = model.name;
    entity.description = model.description ?? undefined;
    if (model.is_default) entity.is_default = model.is_default;
    entity.created_at = model.created_at;
    entity.updated_at = model.updated_at;
    return entity;
  }
}
