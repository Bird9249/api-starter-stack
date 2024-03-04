import Profile from "../../domain/entities/profile.entity";
import { InsertProfileSchema, ProfileSchema } from "../schema/profiles";

export class ProfileMapper {
  toModel(entity: Profile): InsertProfileSchema {
    return {
      id: entity.id,
      first_name: entity.first_name,
      last_name: entity.last_name,
      image: entity.image,
      created_at: entity.created_at,
      updated_at: entity.updated_at,
      user_id: entity.user.id,
    };
  }

  toEntity(model: ProfileSchema): Profile {
    const entity = new Profile();
    entity.id = model.id;
    entity.first_name = model.first_name;
    entity.last_name = model.last_name;
    entity.image = model.image;
    entity.created_at = model.created_at;
    entity.updated_at = model.updated_at;
    return entity;
  }

  private static instance: ProfileMapper;

  public static getInstance(): ProfileMapper {
    if (!ProfileMapper.instance) {
      ProfileMapper.instance = new ProfileMapper();
    }

    return ProfileMapper.instance;
  }
}
