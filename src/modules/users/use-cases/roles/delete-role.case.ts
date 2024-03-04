import { HTTPException } from "hono/http-exception";
import { Inject, Service } from "typedi";
import ICommandHandler from "../../../../common/interfaces/cqrs/command.interface";
import DeleteRoleCommand from "../../domain/commands/roles/delete-role.command";
import { RoleDrizzleRepo } from "../../drizzle/roles/role.repository";

@Service()
export default class DeleteRoleCase
  implements ICommandHandler<DeleteRoleCommand, string>
{
  constructor(@Inject() private readonly _repository: RoleDrizzleRepo) {}

  async execute({ id }: DeleteRoleCommand): Promise<string> {
    const role = await this._repository.getById(id);

    if (!role)
      throw new HTTPException(404, {
        message: "ຂໍ້ມູນບົດບາດນີ້ບໍ່​ມີໃນລະບົບ",
      });

    if (role && role.is_default)
      throw new HTTPException(409, {
        message: "ບົດບາດນີ້ບໍ່ສາມາດລຶບໄດ້",
      });

    await this._repository.remove(id);

    return "ລຶບບົດບາດສຳເລັດ";
  }
}
