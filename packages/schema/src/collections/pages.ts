import { defineCollection } from "../defineCollection.js";

export const pagesCollection = defineCollection({
  slug: "pages",
  tableName: "jodkit_pages",
  fields: [
    { name: "id", type: "uuid", primaryKey: true, required: true },
    { name: "slug", type: "text", required: true, unique: true },
    { name: "title", type: "text", required: true },
    { name: "body", type: "text", required: true },
    {
      name: "status",
      type: "string",
      required: true,
      enum: ["draft", "published"],
    },
    { name: "published_at", type: "datetime", required: false },
    { name: "created_at", type: "datetime", required: true },
    { name: "updated_at", type: "datetime", required: true },
  ],
});
