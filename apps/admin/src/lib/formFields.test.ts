import { describe, expect, it } from "vitest";
import { fieldsForCreateForm, type AdminCollectionMeta } from "./formFields.js";

const sample: AdminCollectionMeta = {
  slug: "pages",
  fields: [
    { name: "id", type: "uuid", primaryKey: true, required: true },
    { name: "slug", type: "text", required: true },
    { name: "title", type: "text", required: true },
    { name: "status", type: "string", enum: ["draft", "published"] },
    { name: "created_at", type: "datetime", required: true },
    { name: "updated_at", type: "datetime", required: true },
  ],
};

describe("fieldsForCreateForm", () => {
  it("omits read-only and primary key fields", () => {
    const names = fieldsForCreateForm(sample).map((f) => f.name);
    expect(names).toEqual(["slug", "title", "status"]);
  });
});
