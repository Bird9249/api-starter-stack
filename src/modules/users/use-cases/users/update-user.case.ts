import { password } from "bun";
import { HTTPException } from "hono/http-exception";
import ICommandHandler from "../../../../common/interfaces/cqrs/command.interface";
import { BunFileUpload } from "../../../../infrastructure/file-upload/bun/bun-file-upload.service";
import UpdateUserCommand from "../../domain/commands/users/update-user.command";
import Profile from "../../domain/entities/profile.entity";
import Role from "../../domain/entities/role.entity";
import { UserDrizzleRepo } from "../../drizzle/user/user.repository";

export default class UpdateUserCase
  implements ICommandHandler<UpdateUserCommand, string>
{
  private readonly _repository = UserDrizzleRepo.getInstance();
  private readonly _fileUpload = BunFileUpload.getInstance();

  async execute({ id, dto }: UpdateUserCommand): Promise<string> {
    const user = await this._repository.getById(id);

    if (!user)
      throw new HTTPException(404, { message: "ຜູ້ໃຊ້ນີ້ບໍ່ມີໃນລະບົບ" });

    user.id = id;
    user.email = dto.email.value;
    if (dto.password) user.password = password.hashSync(dto.password);

    const profile = new Profile();
    profile.first_name = dto.first_name;
    profile.last_name = dto.last_name;
    if (dto.image) {
      if (user.profile) this._fileUpload.remove(user.profile.image);

      profile.image = await this._fileUpload.upload(
        "public/profile/",
        <File>dto.image
      );
    }
    profile.user = user;
    profile.updated_at = new Date();

    user.profile = profile;
    user.roles = dto.role_ids.map((val) => {
      const role = new Role();
      role.id = val;
      return role;
    });
    user.updated_at = new Date();

    await this._repository.update(user);

    return "ອັບເດດຜູ້ໃຊ້ສຳເລັດ";
  }

  private static instance: UpdateUserCase;
  public static getInstance(): UpdateUserCase {
    if (!UpdateUserCase.instance) {
      UpdateUserCase.instance = new UpdateUserCase();
    }

    return UpdateUserCase.instance;
  }
}
