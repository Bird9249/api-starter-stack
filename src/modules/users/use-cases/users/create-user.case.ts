import { password } from "bun";
import ICommandHandler from "../../../../common/interfaces/cqrs/command.interface";
import { BunFileUpload } from "../../../../infrastructure/file-upload/bun/bun-file-upload.service";
import CreateUserCommand from "../../domain/commands/users/create-user.command";
import Profile from "../../domain/entities/profile.entity";
import Role from "../../domain/entities/role.entity";
import User from "../../domain/entities/user.entity";
import { UserDrizzleRepo } from "../../drizzle/user/user.repository";

export default class CreateUserCase
  implements ICommandHandler<CreateUserCommand, string>
{
  private readonly _repository = UserDrizzleRepo.getInstance();
  private readonly _fileUpload = BunFileUpload.getInstance();

  async execute({ dto }: CreateUserCommand): Promise<string> {
    const user = new User();
    user.email = dto.email;
    user.password = password.hashSync(dto.password);
    const profile = new Profile();
    profile.first_name = dto.first_name;
    profile.last_name = dto.last_name;
    profile.image = await this._fileUpload.upload(
      "public/profile/",
      <File>dto.image
    );
    user.profile = profile;
    user.roles = dto.role_ids.map((val) => {
      const role = new Role();
      role.id = val;
      return role;
    });

    await this._repository.create(user);

    return "ເພີ່ມຜູ້ໃຊ້ສຳເລັດ";
  }

  private static instance: CreateUserCase;
  public static getInstance(): CreateUserCase {
    if (!CreateUserCase.instance) {
      CreateUserCase.instance = new CreateUserCase();
    }

    return CreateUserCase.instance;
  }
}
