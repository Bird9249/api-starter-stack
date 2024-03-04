import { relations } from "drizzle-orm";
import { integer, pgTable, primaryKey } from "drizzle-orm/pg-core";
import { permissions } from "./permissions";
import { roles } from "./roles";

export const rolesToPermissions = pgTable(
  "roles_to_permissions",
  {
    role_id: integer("role_id")
      .notNull()
      .references(() => roles.id, {
        onDelete: "cascade",
        onUpdate: "no action",
      }),
    permission_id: integer("permission_id")
      .notNull()
      .references(() => permissions.id, {
        onDelete: "cascade",
        onUpdate: "no action",
      }),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.role_id, t.permission_id] }),
  })
);

export const rolesToPermissionsRelations = relations(
  rolesToPermissions,
  ({ one }) => ({
    role: one(roles, {
      fields: [rolesToPermissions.role_id],
      references: [roles.id],
    }),
    permission: one(permissions, {
      fields: [rolesToPermissions.permission_id],
      references: [permissions.id],
    }),
  })
);
