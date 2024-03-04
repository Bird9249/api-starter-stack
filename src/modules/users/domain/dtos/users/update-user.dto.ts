import {
  Input,
  blob,
  customAsync,
  email,
  maxSize,
  mergeAsync,
  mimeType,
  minLength,
  number,
  objectAsync,
  omitAsync,
  optional,
  string,
  stringAsync,
} from "valibot";
import { UserDrizzleRepo } from "../../../drizzle/user/user.repository";
import { CreateUserDto } from "./create-user.dto";

const repository = UserDrizzleRepo.getInstance();

const UpdateUserDto = mergeAsync([
  omitAsync(CreateUserDto, ["password", "email", "image"]),
  objectAsync({
    email: objectAsync(
      {
        id: number(),
        value: stringAsync("ຈະຕ້ອງບໍ່ຫວ່າງເປົ່າ.", [
          email("ຕ້ອງເປັນຮູບແບບອີເມວທີ່ຖືກຕ້ອງ."),
        ]),
      },
      [
        customAsync(
          async ({ id, value }) =>
            !(await repository.checkDuplicate(value, id)),
          "ອີເມວນີ້ມີໃນລະບົບແລ້ວ"
        ),
      ]
    ),
    password: optional(
      string([minLength(8, "ຄວາມຍາວຕໍ່າສຸດທີ່ຕ້ອງການແມ່ນ 8 ຕົວອັກສອນ.")])
    ),
    image: optional(
      blob("ກະລຸນາເລືອກໄຟລ໌ຮູບພາບ.", [
        mimeType(
          ["image/jpeg", "image/png", "image/webp"],
          "ກະລຸນາເລືອກໄຟລ໌ JPEG ຫຼື PNG ຫຼື Webp."
        ),
        maxSize(1024 * 1024 * 10, "ກະລຸນາເລືອກໄຟລ໌ທີ່ນ້ອຍກວ່າ 10 MB."),
      ])
    ),
  }),
]);

type UpdateUserDtoType = Input<typeof UpdateUserDto>;

export { UpdateUserDto, type UpdateUserDtoType };
