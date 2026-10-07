import { numeric, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const jodkitProducts = pgTable("jodkit_products", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  price: numeric("price", { precision: 12, scale: 2 }).notNull(),
  created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});
