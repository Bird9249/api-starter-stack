import User from "./user.entity";

export default class Session {
  id!: string;
  user!: User;
  created_at!: Date;
}
