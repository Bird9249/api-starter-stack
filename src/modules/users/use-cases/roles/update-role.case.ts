import { HTTPException } from "hono/http-exception";
import ICommandHandler from "../../../../common/interfaces/cqrs/command.interface";
import UpdateRoleCommand from "../../domain/commands/roles/update-role.command";
import Permission from "../../domain/entities/permission.entity";
import { RoleDrizzleRepo } from "../../drizzle/roles/role.repository";

export default class UpdateRoleCase
  implements ICommandHandler<UpdateRoleCommand, string>
{
  private readonly _repository = RoleDrizzleRepo.getInstance();

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

  private static instance: UpdateRoleCase;
  public static getInstance(): UpdateRoleCase {
    if (!UpdateRoleCase.instance) {
      UpdateRoleCase.instance = new UpdateRoleCase();
    }

    return UpdateRoleCase.instance;
  }
}
