import { HTTPException } from "hono/http-exception";
import { Inject, Service } from "typedi";
import ICommandHandler from "../../../../common/interfaces/cqrs/command.interface";
import { BunFileUpload } from "../../../../infrastructure/file-upload/bun/bun-file-upload.service";
import DeleteUserCommand from "../../domain/commands/users/delete-user.command";
import { UserDrizzleRepo } from "../../drizzle/user/user.repository";

@Service()
export default class DeleteUserCase
  implements ICommandHandler<DeleteUserCommand, string>
{
  constructor(
    @Inject() private readonly _repository: UserDrizzleRepo,
    @Inject() private readonly _upload: BunFileUpload
  ) {}

  async execute({ id }: DeleteUserCommand): Promise<string> {
    const user = await this._repository.getById(id);

    if (!user)
      throw new HTTPException(404, { message: "ຜູ້ໃຊ້ນີ້ບໍ່ມີໃນລະບົບ" });

    if (
      user.roles?.some((val) => val.is_default === true) ||
      user.roles?.some((val) => val.is_default === true)
    )
      throw new HTTPException(409, { message: "ບໍ່ສາມາດລຶບຜູ້ໃຊ້ນີ້ໄດ້" });

    if (user.profile && user.profile.image)
      await this._upload.remove(user.profile.image);

    await this._repository.remove(id);

    return "ລຶບຜູ້ໃຊ້ສຳເລັດ";
  }
}
