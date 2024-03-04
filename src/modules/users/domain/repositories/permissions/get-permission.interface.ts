import IQueryHandler from "../../../../../common/interfaces/cqrs/query.interface";
import Permission from "../../entities/permission.entity";
import GetPermissionsQuery from "../../queries/permissions/get-user.query";

export default interface IGetPermissionRepository
  extends IQueryHandler<GetPermissionsQuery, Permission[]> {}
