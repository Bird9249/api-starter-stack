import { Inject, Service } from "typedi";
import ICommandHandler from "../../../../common/interfaces/cqrs/command.interface";
import { IPayload } from "../../../../infrastructure/jwt/generate-jwt.interface";
import { HonoGenerateJwtService } from "../../../../infrastructure/jwt/hono/hono-generate-jwt.service";
import RefreshTokenCommand from "../../domain/commands/auth/refresh-token.command";
import Session from "../../domain/entities/session.entity";
import User from "../../domain/entities/user.entity";
import { AuthDrizzleRepo } from "../../drizzle/auth/auth.repository";

@Service()
export default class RefreshTokenCase
  implements
    ICommandHandler<
      RefreshTokenCommand,
      { access_token: string; refresh_token: string; message: string }
    >
{
  constructor(
    @Inject() private readonly _generateJwt: HonoGenerateJwtService,
    @Inject() private readonly _repository: AuthDrizzleRepo
  ) {}

  async execute({ token }: RefreshTokenCommand): Promise<{
    access_token: string;
    refresh_token: string;
    message: string;
  }> {
    const decode = this._generateJwt.decode(token);

    const token_id = crypto.randomUUID();

    const payload: IPayload = {
      token_id,
      sub: decode.sub,
    };

    const accessToken = await this._generateJwt.sign(payload, {
      duration: "weeks",
      value: 1,
    });

    const refreshToken = await this._generateJwt.sign(payload, {
      duration: "weeks",
      value: 2,
    });

    await this._saveSession(Number(decode.sub), token_id);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      message: "Refresh token successfully",
    };
  }

  private async _saveSession(userId: number, id: string): Promise<void> {
    const session = new Session();
    session.id = id;
    const user = new User();
    user.id = userId;
    session.user = user;

    await this._repository.createSession(session);
  }
}
