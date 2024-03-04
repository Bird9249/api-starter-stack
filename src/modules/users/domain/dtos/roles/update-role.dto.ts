import { Input } from "valibot";
import { CreateRoleDto } from "./create-role.dto";

const UpdateRoleDto = CreateRoleDto;

type UpdateRoleDtoType = Input<typeof UpdateRoleDto>;

export { UpdateRoleDto, type UpdateRoleDtoType };
