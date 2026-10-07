import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const jodkitUsers = pgTable("jodkit_users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  display_name: text("display_name").notNull(),
  created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});
