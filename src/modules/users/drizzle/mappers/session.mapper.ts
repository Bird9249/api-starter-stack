import Session from "../../domain/entities/session.entity";
import { InsertSessionSchema, SessionSchema } from "../schema/sessions";

export class SessionMapper {
  toModel(entity: Session): InsertSessionSchema {
    return {
      id: entity.id,
      user_id: entity.user.id,
      created_at: entity.created_at,
    };
  }

  toEntity(model: SessionSchema): Session {
    const entity = new Session();
    entity.id = model.id;
    entity.created_at = model.created_at;
    return entity;
  }

  private static instance: SessionMapper;

  public static getInstance(): SessionMapper {
    if (!SessionMapper.instance) {
      SessionMapper.instance = new SessionMapper();
    }

    return SessionMapper.instance;
  }
}
