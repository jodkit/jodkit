import { defineCollection } from "../defineCollection.js";

export const usersCollection = defineCollection({
  slug: "users",
  tableName: "jodkit_users",
  fields: [
    { name: "id", type: "uuid", primaryKey: true, required: true },
    { name: "email", type: "text", required: true, unique: true },
    { name: "display_name", type: "text", required: true },
    { name: "created_at", type: "datetime", required: true },
    { name: "updated_at", type: "datetime", required: true },
  ],
});
