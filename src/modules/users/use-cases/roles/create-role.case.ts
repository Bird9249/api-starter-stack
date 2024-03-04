import { Inject, Service } from "typedi";
import ICommandHandler from "../../../../common/interfaces/cqrs/command.interface";
import CreateRoleCommand from "../../domain/commands/roles/create-role.command";
import Permission from "../../domain/entities/permission.entity";
import Role from "../../domain/entities/role.entity";
import { RoleDrizzleRepo } from "../../drizzle/roles/role.repository";

@Service()
export default class CreateRoleCase
  implements ICommandHandler<CreateRoleCommand, string>
{
  constructor(@Inject() private readonly _repository: RoleDrizzleRepo) {}

  async execute({ dto }: CreateRoleCommand): Promise<string> {
    const role = new Role();
    role.name = dto.name;
    role.description = dto.description;
    role.permissions = dto.permission_ids.map((val) => {
      const permission = new Permission();
      permission.id = val;
      return permission;
    });

    await this._repository.create(role);

    return "ເພີ່ມບົດບາດສຳເລັດ";
  }
}
