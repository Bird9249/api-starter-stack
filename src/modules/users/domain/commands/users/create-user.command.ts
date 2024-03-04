import { CreateUserDtoType } from "../../dtos/users/create-user.dto";

type Dto = Omit<CreateUserDtoType, "role_ids"> & {
  role_ids: number[];
};

export default class CreateUserCommand {
  constructor(public readonly dto: Dto) {}
}
