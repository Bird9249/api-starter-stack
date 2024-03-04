import { LoginDtoType } from "../../dtos/auth/login.dto";

export default class LoginCommand {
  constructor(public readonly dto: LoginDtoType) {}
}
