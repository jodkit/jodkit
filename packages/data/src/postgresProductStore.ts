import { desc, eq } from "drizzle-orm";
import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import type { Pool } from "pg";
import { jodkitProducts } from "./tables/products.js";
import type {
  CreateProductInput,
  PatchProductInput,
  ProductRecord,
  ProductStore,
} from "./productStore.js";

function rowToRecord(row: typeof jodkitProducts.$inferSelect): ProductRecord {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    price: Number(row.price),
    created_at: row.created_at.toISOString(),
    updated_at: row.updated_at.toISOString(),
  };
}

export class PostgresProductStore implements ProductStore {
  private readonly db: NodePgDatabase;

  constructor(pool: Pool) {
    this.db = drizzle(pool);
  }

  async list(limit = 20, offset = 0): Promise<ProductRecord[]> {
    const rows = await this.db
      .select()
      .from(jodkitProducts)
      .orderBy(desc(jodkitProducts.created_at))
      .limit(limit)
      .offset(offset);
    return rows.map(rowToRecord);
  }

  async get(id: string): Promise<ProductRecord | undefined> {
    const rows = await this.db.select().from(jodkitProducts).where(eq(jodkitProducts.id, id));
    const row = rows[0];
    return row ? rowToRecord(row) : undefined;
  }

  async create(input: CreateProductInput | Record<string, unknown>): Promise<ProductRecord> {
    const body: CreateProductInput = {
      name: String(input.name),
      slug: String(input.slug),
      price: Number(input.price),
    };
    try {
      const rows = await this.db
        .insert(jodkitProducts)
        .values({
          name: body.name,
          slug: body.slug,
          price: String(body.price),
        })
        .returning();
      const row = rows[0];
      if (!row) throw new Error("INSERT_FAILED");
      return rowToRecord(row);
    } catch (e) {
      if (isPgUniqueViolation(e)) {
        throw new Error("CONFLICT: slug exists");
      }
      throw e;
    }
  }

  async patch(
    id: string,
    input: PatchProductInput | Record<string, unknown>,
  ): Promise<ProductRecord | undefined> {
    const existing = await this.get(id);
    if (!existing) return undefined;

    const updates: Partial<typeof jodkitProducts.$inferInsert> = {
      updated_at: new Date(),
    };
    if (input.name !== undefined) updates.name = input.name;
    if (input.slug !== undefined) updates.slug = input.slug;
    if (input.price !== undefined) updates.price = String(input.price);

    try {
      const rows = await this.db
        .update(jodkitProducts)
        .set(updates)
        .where(eq(jodkitProducts.id, id))
        .returning();
      const row = rows[0];
      return row ? rowToRecord(row) : undefined;
    } catch (e) {
      if (isPgUniqueViolation(e)) {
        throw new Error("CONFLICT: slug exists");
      }
      throw e;
    }
  }

  async delete(id: string): Promise<boolean> {
    const rows = await this.db
      .delete(jodkitProducts)
      .where(eq(jodkitProducts.id, id))
      .returning({ id: jodkitProducts.id });
    return rows.length > 0;
  }
}

function isPgUniqueViolation(err: unknown): boolean {
  return (
    typeof err === "object" &&
    err !== null &&
    "code" in err &&
    (err as { code: string }).code === "23505"
  );
}
