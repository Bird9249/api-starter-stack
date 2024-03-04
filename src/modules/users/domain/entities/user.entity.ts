import Profile from "./profile.entity";
import Role from "./role.entity";
import Session from "./session.entity";

export default class User {
  id!: number;
  email!: string;
  password!: string;
  created_at!: Date;
  updated_at!: Date;
  profile?: Profile;
  sessions?: Session[];
  roles?: Role[];
}
