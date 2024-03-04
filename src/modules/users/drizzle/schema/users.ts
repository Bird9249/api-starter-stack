import { relations } from "drizzle-orm";

import { pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { profiles } from "./profiles";
import { sessions } from "./sessions";
import { usersToRoles } from "./users_to_roles";

export const users = pgTable("users", {
  id: serial("id").primaryKey().notNull(),
  email: varchar("email", { length: 100 }).notNull(),
  password: text("password").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ one, many }) => ({
  profile: one(profiles, {
    fields: [users.id],
    references: [profiles.user_id],
  }),
  sessions: many(sessions),
  usersToRoles: many(usersToRoles),
}));

export type UserSchema = typeof users.$inferSelect;
export type InsertUserSchema = typeof users.$inferSelect;
