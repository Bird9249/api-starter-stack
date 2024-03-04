import { relations } from "drizzle-orm";
import { char, integer, pgTable, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users";

export const sessions = pgTable("sessions", {
  id: char("id", { length: 36 }).primaryKey().notNull(),
  user_id: integer("user_id")
    .references(() => users.id, { onDelete: "cascade", onUpdate: "no action" })
    .notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.user_id], references: [users.id] }),
}));

export type SessionSchema = typeof sessions.$inferSelect;
export type InsertSessionSchema = typeof sessions.$inferInsert;
