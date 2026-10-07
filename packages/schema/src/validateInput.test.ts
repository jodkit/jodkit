import { describe, expect, it } from "vitest";
import { defineCollection } from "./defineCollection.js";
import { pagesCollection } from "./collections/pages.js";
import { productsCollection } from "./collections/products.js";
import { validateCollectionInput } from "./validateInput.js";

const moneyProbeCollection = defineCollection({
  slug: "money_probe",
  fields: [
    { name: "id", type: "uuid", primaryKey: true, required: true },
    { name: "amount", type: "money", required: true },
    { name: "created_at", type: "datetime", required: true },
    { name: "updated_at", type: "datetime", required: true },
  ],
});

describe("validateCollectionInput", () => {
  it("create requires name, slug, price", () => {
    const r = validateCollectionInput(productsCollection, {}, "create");
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errors.length).toBeGreaterThan(0);
  });

  it("create rejects read-only fields", () => {
    const r = validateCollectionInput(
      productsCollection,
      { id: "x", name: "a", slug: "b", price: 1 },
      "create",
    );
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errors.some((e) => e.code === "READ_ONLY")).toBe(true);
  });

  it("create accepts valid body and coerces price", () => {
    const r = validateCollectionInput(
      productsCollection,
      { name: "Widget", slug: "widget", price: "9.5" },
      "create",
    );
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.value.price).toBe(9.5);
    }
  });

  it("patch requires at least one mutable field", () => {
    const r = validateCollectionInput(productsCollection, {}, "patch");
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errors[0]?.code).toBe("EMPTY_PATCH");
  });

  it("patch accepts partial update", () => {
    const r = validateCollectionInput(productsCollection, { name: "New" }, "patch");
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value).toEqual({ name: "New" });
  });

  it("create coerces money field", () => {
    const r = validateCollectionInput(moneyProbeCollection, { amount: "12.5" }, "create");
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value.amount).toBe(12.5);
  });

  it("pages create accepts draft status", () => {
    const r = validateCollectionInput(
      pagesCollection,
      {
        slug: "home",
        title: "Home",
        body: "Welcome",
        status: "draft",
      },
      "create",
    );
    expect(r.ok).toBe(true);
  });

  it("pages create rejects invalid status enum", () => {
    const r = validateCollectionInput(
      pagesCollection,
      {
        slug: "home",
        title: "Home",
        body: "Welcome",
        status: "archived",
      },
      "create",
    );
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errors.some((e) => e.code === "INVALID_ENUM")).toBe(true);
  });

  it("pages patch validates enum on status", () => {
    const r = validateCollectionInput(pagesCollection, { status: "nope" }, "patch");
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errors[0]?.code).toBe("INVALID_ENUM");
  });
});
