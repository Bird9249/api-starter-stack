import { relations } from "drizzle-orm";

import { boolean, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { rolesToPermissions } from "./roles_to_permissions";
import { usersToRoles } from "./users_to_roles";

export const roles = pgTable("roles", {
  id: serial("id").primaryKey().notNull(),
  name: varchar("name", { length: 50 }).notNull(),
  description: text("description"),
  is_default: boolean('is_default').default(false).notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const roleRelations = relations(roles, ({ many }) => ({
  usersToRoles: many(usersToRoles),
  rolesToPermissions: many(rolesToPermissions),
}));

export type RoleSchema = typeof roles.$inferSelect;
export type InsertRoleSchema = typeof roles.$inferInsert;
