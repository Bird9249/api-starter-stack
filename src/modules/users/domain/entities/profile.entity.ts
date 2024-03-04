import User from "./user.entity";

export default class Profile {
  id!: number;
  first_name!: string;
  last_name!: string;
  image!: string;
  created_at!: Date;
  updated_at!: Date;
  user!: User;
}
