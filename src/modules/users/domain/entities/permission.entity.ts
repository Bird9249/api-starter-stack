import Role from "./role.entity";

export enum PermissionNames {
  Read = "read",
  Write = "write",
  Remove = "remove",
}

export enum PermissionGroup {
  User = "user",
}

export default class Permission {
  id!: number;
  name!: string;
  group_name!: PermissionGroup;
  description?: string;
  created_at!: Date;
  roles?: Role[];
}
