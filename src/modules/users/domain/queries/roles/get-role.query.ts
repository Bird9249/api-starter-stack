import { IOffsetBasePaginate } from "../../../../../common/interfaces/pagination/pagination.interface";
import Role from "../../entities/role.entity";

export default class GetRoleQuery {
  constructor(public readonly paginate: IOffsetBasePaginate<Role>) {}
}
