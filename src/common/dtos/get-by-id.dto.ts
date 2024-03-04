import { Input, object, string, transform } from "valibot";

const GetByIdDto = object({
  id: transform(string("ຈະຕ້ອງບໍ່ຫວ່າງເປົ່າ"), (input) => Number(input)),
});

type GetByIdDtoType = Input<typeof GetByIdDto>;

export { GetByIdDto, type GetByIdDtoType };
