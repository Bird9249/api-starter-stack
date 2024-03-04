import { UpdateRoleDtoType } from "../../dtos/roles/update-role.dto";

export default class UpdateRoleCommand {
  constructor(public readonly id: number, public readonly dto: UpdateRoleDtoType) {}
}
