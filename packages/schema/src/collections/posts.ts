import { defineCollection } from "../defineCollection.js";

export const postsCollection = defineCollection({
  slug: "posts",
  tableName: "jodkit_posts",
  fields: [
    { name: "id", type: "uuid", primaryKey: true, required: true },
    { name: "slug", type: "text", required: true, unique: true },
    { name: "title", type: "text", required: true },
    { name: "body", type: "text", required: true },
    { name: "page_id", type: "relation", relationTo: "pages", required: true },
    { name: "created_at", type: "datetime", required: true },
    { name: "updated_at", type: "datetime", required: true },
  ],
});
