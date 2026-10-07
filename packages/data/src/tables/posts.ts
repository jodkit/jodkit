import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { jodkitPages } from "./pages.js";

export const jodkitPosts = pgTable("jodkit_posts", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  body: text("body").notNull(),
  page_id: uuid("page_id")
    .notNull()
    .references(() => jodkitPages.id),
  created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});
