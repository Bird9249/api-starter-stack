import Permission from "./permission.entity";
import User from "./user.entity";

export default class Role {
  id!: number;
  name!: string;
  description?: string;
  is_default!: boolean;
  created_at!: Date;
  updated_at!: Date;
  users?: User[];
  permissions?: Permission[];
}
