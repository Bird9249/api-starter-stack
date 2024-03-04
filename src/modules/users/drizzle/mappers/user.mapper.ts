import User from "../../domain/entities/user.entity";
import { InsertUserSchema, UserSchema } from "../schema/users";

export class UserMapper {
  toModel(entity: User): InsertUserSchema {
    return {
      id: entity.id,
      email: entity.email,
      password: entity.password,
      created_at: entity.created_at,
      updated_at: entity.updated_at,
    };
  }

  toEntity(model: Omit<UserSchema, "password"> & { password?: string }): User {
    const entity = new User();
    entity.id = model.id;
    entity.email = model.email;
    if (model.password) entity.password = model.password;
    entity.created_at = model.created_at;
    entity.updated_at = model.updated_at;
    return entity;
  }

  private static instance: UserMapper;

  public static getInstance(): UserMapper {
    if (!UserMapper.instance) {
      UserMapper.instance = new UserMapper();
    }

    return UserMapper.instance;
  }
}
