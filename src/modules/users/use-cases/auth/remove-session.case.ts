import { HTTPException } from "hono/http-exception";
import { Inject, Service } from "typedi";
import ICommandHandler from "../../../../common/interfaces/cqrs/command.interface";
import RemoveSessionCommand from "../../domain/commands/auth/remove-session.command";
import { AuthDrizzleRepo } from "../../drizzle/auth/auth.repository";

@Service()
export default class RemoveSessionCase
  implements ICommandHandler<RemoveSessionCommand, void>
{
  constructor(@Inject() private readonly _repository: AuthDrizzleRepo) {}

  async execute({ tokenId }: RemoveSessionCommand): Promise<void> {
    const session = await this._repository.getSession(tokenId);

    if (!session) throw new HTTPException(404, { message: "ບໍ່ພົບ Session" });

    await this._repository.removeSession(session.id);
  }
}
