import IQueryHandler from "../../../../../common/interfaces/cqrs/query.interface";
import Session from "../../entities/session.entity";
import User from "../../entities/user.entity";
import GetUserByIdQuery from "../../queries/users/get-user-by-id.query";

export type GetUserByIdResult =
  | (Partial<Omit<User, "sessions">> & {
      permissions: string[];
      session: Session;
    })
  | void;

export default interface IGetUserByIdRepository
  extends IQueryHandler<GetUserByIdQuery, GetUserByIdResult> {}
