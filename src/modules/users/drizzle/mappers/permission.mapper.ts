import Permission, {
  PermissionGroup,
} from "../../domain/entities/permission.entity";
import {
  InsertPermissionSchema,
  PermissionSchema,
} from "../schema/permissions";

export class PermissionMapper {
  toModel(entity: Permission): InsertPermissionSchema {
    return {
      id: entity.id,
      name: entity.name,
      group_name: entity.group_name,
      description: entity.description,
      created_at: entity.created_at,
    };
  }

  toEntity(model: PermissionSchema): Permission {
    const entity = new Permission();
    entity.id = model.id;
    entity.name = model.name;
    entity.group_name = <PermissionGroup>model.group_name;
    entity.description = model.description ?? undefined;
    entity.created_at = model.created_at;
    return entity;
  }

  private static instance: PermissionMapper;

  public static getInstance(): PermissionMapper {
    if (!PermissionMapper.instance) {
      PermissionMapper.instance = new PermissionMapper();
    }

    return PermissionMapper.instance;
  }
}
