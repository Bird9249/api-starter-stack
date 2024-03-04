import { CreateRoleDtoType } from "../../dtos/roles/create-role.dto";

export default class CreateRoleCommand {
  constructor(public readonly dto: CreateRoleDtoType) {}
}
