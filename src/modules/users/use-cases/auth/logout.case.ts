import { HTTPException } from "hono/http-exception";
import ICommandHandler from "../../../../common/interfaces/cqrs/command.interface";
import { HonoGenerateJwtService } from "../../../../infrastructure/jwt/hono/hono-generate-jwt.service";
import LogoutCommand from "../../domain/commands/auth/logout.command";
import { AuthDrizzleRepo } from "../../drizzle/auth/auth.repository";

export default class LogoutCase
  implements ICommandHandler<LogoutCommand, string>
{
  private readonly _repository = AuthDrizzleRepo.getInstance();
  private readonly _generateJwt = HonoGenerateJwtService.getInstance();

  async execute({ token }: LogoutCommand): Promise<string> {
    const payload = this._generateJwt.decode(token);

    const session = await this._repository.getSession(payload.token_id);

    if (!session) throw new HTTPException(404, { message: "ບໍ່ພົບ Session" });

    await this._repository.removeSession(session.id);

    return "ອອກຈາກລະບົບສຳເລັດແລ້ວ";
  }

  private static instance: LogoutCase;
  public static getInstance(): LogoutCase {
    if (!LogoutCase.instance) {
      LogoutCase.instance = new LogoutCase();
    }

    return LogoutCase.instance;
  }
}
