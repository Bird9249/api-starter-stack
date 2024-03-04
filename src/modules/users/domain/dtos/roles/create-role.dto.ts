import {
  Input,
  arrayAsync,
  customAsync,
  maxLength,
  minLength,
  number,
  objectAsync,
  optional,
  string,
} from "valibot";
import { PermissionDrizzleRepo } from "../../../drizzle/permissions/permission.repository";

const permissionRepository = PermissionDrizzleRepo.getInstance();

const CreateRoleDto = objectAsync({
  name: string("ຈະຕ້ອງບໍ່ຫວ່າງເປົ່າ.", [
    minLength(3, "ຄວາມຍາວຕໍ່າສຸດທີ່ຕ້ອງການແມ່ນ 3 ຕົວອັກສອນ."),
    maxLength(255, "ຄວາມຍາວສູງສຸດທີ່ອະນຸຍາດແມ່ນ 255 ຕົວອັກສອນ."),
  ]),
  description: optional(string("ຈະຕ້ອງເປັນຕົວອັກສອນ.")),
  permission_ids: arrayAsync(number("ຕ້ອງເປັນຕົວເລກ."), [
    customAsync(
      async (input) =>
        (await permissionRepository.checkIdsIsExist(input)).length ===
        input.length,
      "ຂໍ້ມຼນການອະນຸຍາດບາງລາຍການບໍ່ມີໃນລະບົບ"
    ),
  ]),
});

type CreateRoleDtoType = Input<typeof CreateRoleDto>;

export { CreateRoleDto, type CreateRoleDtoType };
