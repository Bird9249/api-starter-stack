import { relations } from "drizzle-orm";
import { integer, pgTable, primaryKey } from "drizzle-orm/pg-core";
import { roles } from "./roles";
import { users } from "./users";

export const usersToRoles = pgTable(
  "users_to_roles",
  {
    user_id: integer("user_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
        onUpdate: "no action",
      }),
    role_id: integer("role_id")
      .notNull()
      .references(() => roles.id, {
        onDelete: "cascade",
        onUpdate: "no action",
      }),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.user_id, t.role_id] }),
  })
);

export const usersToRolesRelations = relations(usersToRoles, ({ one }) => ({
  user: one(users, {
    fields: [usersToRoles.user_id],
    references: [users.id],
  }),
  role: one(roles, {
    fields: [usersToRoles.role_id],
    references: [roles.id],
  }),
}));
