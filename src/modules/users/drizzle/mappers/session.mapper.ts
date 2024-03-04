import { Service } from "typedi";
import Session from "../../domain/entities/session.entity";
import { InsertSessionSchema, SessionSchema } from "../schema/sessions";

@Service()
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
}
