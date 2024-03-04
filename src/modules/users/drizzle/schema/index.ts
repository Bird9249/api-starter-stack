import { permissions, permissionsRelations } from "./permissions";
import { profiles, profilesRelations } from "./profiles";
import { roleRelations, roles } from "./roles";
import {
  rolesToPermissions,
  rolesToPermissionsRelations,
} from "./roles_to_permissions";
import { sessions, sessionsRelations } from "./sessions";
import { users, usersRelations } from "./users";
import { usersToRoles, usersToRolesRelations } from "./users_to_roles";

export const schema = {
  users,
  usersRelations,
  profiles,
  profilesRelations,
  sessions,
  sessionsRelations,
  usersToRoles,
  usersToRolesRelations,
  roles,
  roleRelations,
  rolesToPermissions,
  rolesToPermissionsRelations,
  permissions,
  permissionsRelations,
};
