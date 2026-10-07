import { defineCollection } from "../defineCollection.js";

export const productsCollection = defineCollection({
  slug: "products",
  fields: [
    { name: "id", type: "uuid", primaryKey: true, required: true },
    { name: "name", type: "text", required: true },
    { name: "slug", type: "text", required: true, unique: true },
    { name: "price", type: "number", required: true },
    { name: "created_at", type: "datetime", required: true },
    { name: "updated_at", type: "datetime", required: true },
  ],
});
