import { UpdateUserDtoType } from "../../dtos/users/update-user.dto";

type UpdateUserType = Omit<UpdateUserDtoType, "role_ids"> & {
  role_ids: number[];
};

export default class UpdateUserCommand {
  constructor(
    public readonly id: number,
    public readonly dto: UpdateUserType
  ) {}
}
