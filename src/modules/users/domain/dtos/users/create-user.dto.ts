import Container from "typedi";
import {
  Input,
  blob,
  customAsync,
  email,
  maxLength,
  maxSize,
  mimeType,
  minLength,
  objectAsync,
  string,
  stringAsync,
  transformAsync,
} from "valibot";
import { RoleDrizzleRepo } from "../../../drizzle/roles/role.repository";
import { UserDrizzleRepo } from "../../../drizzle/user/user.repository";

const repository = Container.get(UserDrizzleRepo);
const roleRepository = Container.get(RoleDrizzleRepo);

const CreateUserDto = objectAsync({
  first_name: string("ຈະຕ້ອງບໍ່ຫວ່າງເປົ່າ.", [
    minLength(3, "ຄວາມຍາວຕໍ່າສຸດທີ່ຕ້ອງການແມ່ນ 3 ຕົວອັກສອນ."),
    maxLength(255, "ຄວາມຍາວສູງສຸດທີ່ອະນຸຍາດແມ່ນ 255 ຕົວອັກສອນ."),
  ]),
  last_name: string("ຈະຕ້ອງບໍ່ຫວ່າງເປົ່າ.", [
    minLength(3, "ຄວາມຍາວຕໍ່າສຸດທີ່ຕ້ອງການແມ່ນ 3 ຕົວອັກສອນ."),
    maxLength(255, "ຄວາມຍາວສູງສຸດທີ່ອະນຸຍາດແມ່ນ 255 ຕົວອັກສອນ."),
  ]),
  image: blob("ກະລຸນາເລືອກໄຟລ໌ຮູບພາບ.", [
    mimeType(
      ["image/jpeg", "image/png", "image/webp"],
      "ກະລຸນາເລືອກໄຟລ໌ JPEG ຫຼື PNG ຫຼື Webp."
    ),
    maxSize(1024 * 1024 * 10, "ກະລຸນາເລືອກໄຟລ໌ທີ່ນ້ອຍກວ່າ 10 MB."),
  ]),
  email: stringAsync("ຈະຕ້ອງບໍ່ຫວ່າງເປົ່າ.", [
    email("ຕ້ອງເປັນຮູບແບບອີເມວທີ່ຖືກຕ້ອງ."),
    customAsync(
      async (input) => !(await repository.checkDuplicate(input)),
      "ອີເມວນີ້ມີໃນລະບົບແລ້ວ"
    ),
  ]),
  password: string("ຈະຕ້ອງບໍ່ຫວ່າງເປົ່າ.", [
    minLength(8, "ຄວາມຍາວຕໍ່າສຸດທີ່ຕ້ອງການແມ່ນ 8 ຕົວອັກສອນ."),
  ]),
  role_ids: transformAsync(
    stringAsync([
      customAsync(async (input) => {
        if (!input) return true;

        const ids = input.split(",").map((val) => Number(val));

        return (
          (await roleRepository.checkIdsIsExist(ids)).length === input.length
        );
      }, "ບົດບາດບາງລາຍການບໍ່ມີໃນລະບົບ"),
      customAsync(async (input) => {
        if (!input) return true;

        return /^\d+(,\d+)*$/.test(input);
      }, "ຮູບແບບຂໍ້ມູນຕ້ອງເປັນ 1,2,n.."),
    ]),
    (input) => {
      if (!input) return [];

      return input.split(",").map((val) => Number(val));
    }
  ),
});

type CreateUserDtoType = Input<typeof CreateUserDto>;

export { CreateUserDto, type CreateUserDtoType };
