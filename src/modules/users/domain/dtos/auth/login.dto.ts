import { Input, email, minLength, object, string } from "valibot";

const LoginDto = object({
  email: string("ຈະຕ້ອງບໍ່ຫວ່າງເປົ່າ.", [
    email("ຕ້ອງເປັນຮູບແບບອີເມວທີ່ຖືກຕ້ອງ."),
  ]),
  password: string("ຈະຕ້ອງບໍ່ຫວ່າງເປົ່າ.", [
    minLength(8, "ຄວາມຍາວຕໍ່າສຸດທີ່ຕ້ອງການແມ່ນ 8 ຕົວອັກສອນ."),
  ]),
});

type LoginDtoType = Input<typeof LoginDto>;

export { LoginDto, type LoginDtoType };
