import { HTTPException } from "hono/http-exception";
import { Inject, Service } from "typedi";
import ICommandHandler from "../../../../common/interfaces/cqrs/command.interface";
import UpdateRoleCommand from "../../domain/commands/roles/update-role.command";
import Permission from "../../domain/entities/permission.entity";
import { RoleDrizzleRepo } from "../../drizzle/roles/role.repository";

@Service()
export default class UpdateRoleCase
  implements ICommandHandler<UpdateRoleCommand, string>
{
  constructor(@Inject() private readonly _repository: RoleDrizzleRepo) {}

  async execute({ id, dto }: UpdateRoleCommand): Promise<string> {
    const role = await this._repository.getById(id);

    if (!role)
      throw new HTTPException(404, { message: "ຂໍ້ມູນບົດບາດນີ້ບໍ່​ມີໃນລະບົບ" });

    role.id = id;
    role.name = dto.name;
    role.description = dto.description;
    role.permissions = dto.permission_ids.map((val) => {
      const permission = new Permission();
      permission.id = val;
      return permission;
    });
    role.updated_at = new Date();

    await this._repository.update(role);

    return "ອັບເດດບົດບາດສຳເລັດ";
  }
}
