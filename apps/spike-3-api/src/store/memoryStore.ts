import { randomUUID } from "node:crypto";

export type ProductRecord = {
  id: string;
  name: string;
  slug: string;
  price: number;
  created_at: string;
  updated_at: string;
};

export type CreateProductInput = {
  name: string;
  slug: string;
  price: number;
};

export type PatchProductInput = Partial<CreateProductInput>;

export class MemoryProductStore {
  private items = new Map<string, ProductRecord>();
  private bySlug = new Map<string, string>();

  list(limit = 20, offset = 0): ProductRecord[] {
    const all = [...this.items.values()].sort((a, b) =>
      b.created_at.localeCompare(a.created_at),
    );
    return all.slice(offset, offset + limit);
  }

  get(id: string): ProductRecord | undefined {
    return this.items.get(id);
  }

  create(input: CreateProductInput): ProductRecord {
    if (this.bySlug.has(input.slug)) {
      throw new Error("CONFLICT: slug exists");
    }
    const now = new Date().toISOString();
    const record: ProductRecord = {
      id: randomUUID(),
      name: input.name,
      slug: input.slug,
      price: input.price,
      created_at: now,
      updated_at: now,
    };
    this.items.set(record.id, record);
    this.bySlug.set(record.slug, record.id);
    return record;
  }

  patch(id: string, input: PatchProductInput): ProductRecord | undefined {
    const existing = this.items.get(id);
    if (!existing) return undefined;

    if (input.slug !== undefined && input.slug !== existing.slug) {
      if (this.bySlug.has(input.slug)) {
        throw new Error("CONFLICT: slug exists");
      }
      this.bySlug.delete(existing.slug);
      this.bySlug.set(input.slug, id);
    }

    const updated: ProductRecord = {
      ...existing,
      ...input,
      updated_at: new Date().toISOString(),
    };
    this.items.set(id, updated);
    return updated;
  }

  delete(id: string): boolean {
    const existing = this.items.get(id);
    if (!existing) return false;
    this.bySlug.delete(existing.slug);
    this.items.delete(id);
    return true;
  }

  clear(): void {
    this.items.clear();
    this.bySlug.clear();
  }
}
