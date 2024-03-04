import { password } from "bun";
import { HTTPException } from "hono/http-exception";
import ICommandHandler from "../../../../common/interfaces/cqrs/command.interface";
import { IPayload } from "../../../../infrastructure/jwt/generate-jwt.interface";
import { HonoGenerateJwtService } from "../../../../infrastructure/jwt/hono/hono-generate-jwt.service";
import LoginCommand from "../../domain/commands/auth/login.command";
import { LoginDtoType } from "../../domain/dtos/auth/login.dto";
import Session from "../../domain/entities/session.entity";
import User from "../../domain/entities/user.entity";
import { AuthDrizzleRepo } from "../../drizzle/auth/auth.repository";

type ResultType = {
  access_token: string;
  refresh_token: string;
  user: User;
  permissions: string[];
};

export default class LoginCase
  implements ICommandHandler<LoginCommand, ResultType>
{
  private readonly _repository = AuthDrizzleRepo.getInstance();
  private readonly _generateJwt = HonoGenerateJwtService.getInstance();

  async execute({ dto }: LoginCommand): Promise<ResultType> {
    const user = await this._checkUser(dto);

    const token_id = crypto.randomUUID();

    await this._saveSession(user.id, token_id);

    const permissionNames: string[] = [];

    if (user.roles)
      user.roles.forEach(({ permissions }) => {
        if (permissions)
          permissions.forEach(({ name }) => {
            if (!permissionNames.includes(name)) permissionNames.push(name);
          });
      });

    const payload: IPayload = {
      token_id: token_id,
      sub: String(user.id),
      roles: user.roles?.map((val) => val.name),
      permissions: permissionNames,
    };

    delete user.roles;

    return {
      access_token: await this._generateJwt.sign(payload, {
        duration: "weeks",
        value: 1,
      }),
      refresh_token: await this._generateJwt.sign(payload, {
        duration: "weeks",
        value: 2,
      }),
      user,
      permissions: permissionNames,
    };
  }

  private async _checkUser(dto: LoginDtoType): Promise<User> {
    const user = await this._repository.checkUser(dto.email);

    if (!user || !password.verifySync(dto.password, user.password))
      throw new HTTPException(401, {
        message:
          "ຊື່ຜູ້ໃຊ້ ຫຼືລະຫັດຜ່ານບໍ່ຖືກຕ້ອງ. ກະລຸນາກວດເບິ່ງຂໍ້ມູນປະຈໍາຕົວຂອງທ່ານ.",
      });

    return user;
  }

  private async _saveSession(userId: number, id: string): Promise<void> {
    const session = new Session();
    session.id = id;
    const user = new User();
    user.id = userId;
    session.user = user;

    await this._repository.createSession(session);
  }

  private static instance: LoginCase;
  public static getInstance(): LoginCase {
    if (!LoginCase.instance) {
      LoginCase.instance = new LoginCase();
    }

    return LoginCase.instance;
  }
}
