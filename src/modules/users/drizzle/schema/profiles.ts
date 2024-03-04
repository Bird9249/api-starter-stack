import { relations } from "drizzle-orm";

import {
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { users } from "./users";

export const profiles = pgTable("profiles", {
  id: serial("id").primaryKey().notNull(),
  user_id: integer("user_id")
    .references(() => users.id, {
      onDelete: "cascade",
      onUpdate: "no action",
    })
    .notNull(),
  first_name: varchar("first_name", { length: 100 }).notNull(),
  last_name: varchar("last_name", { length: 100 }).notNull(),
  image: varchar("image", { length: 255 }).notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const profilesRelations = relations(profiles, ({ one }) => ({
  user: one(users, {
    fields: [profiles.user_id],
    references: [users.id],
  }),
}));

export type ProfileSchema = typeof profiles.$inferSelect;
export type InsertProfileSchema = typeof profiles.$inferInsert;
