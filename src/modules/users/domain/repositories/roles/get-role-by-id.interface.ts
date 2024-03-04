import IQueryHandler from "../../../../../common/interfaces/cqrs/query.interface";
import Role from "../../entities/role.entity";
import GetRoleByIdQuery from "../../queries/roles/get-role-by-id.query";

export default interface IGetRoleByIdRepository
  extends IQueryHandler<GetRoleByIdQuery, Role> {}
