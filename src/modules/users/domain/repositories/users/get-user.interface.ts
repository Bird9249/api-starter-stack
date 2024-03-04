import IQueryHandler from "../../../../../common/interfaces/cqrs/query.interface";
import { IPaginated } from "../../../../../common/interfaces/pagination/paginated.interface";
import Session from "../../entities/session.entity";
import User from "../../entities/user.entity";
import GetUserQuery from "../../queries/users/get-user.query";

export type GetUsersResult = IPaginated<(Partial<Omit<User, "sessions">> & {
  session: Session;
})>

export default interface IGetUserRepository
  extends IQueryHandler<GetUserQuery, GetUsersResult> {}
