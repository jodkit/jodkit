import { desc, eq } from "drizzle-orm";
import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import type { Pool } from "pg";
import type { CollectionRecordStore } from "./collectionStore.js";
import type { CreatePageInput, PageRecord, PatchPageInput } from "./pageStore.js";
import { jodkitPages } from "./tables/pages.js";

function rowToRecord(row: typeof jodkitPages.$inferSelect): PageRecord {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    body: row.body,
    status: row.status,
    published_at: row.published_at ? row.published_at.toISOString() : null,
    created_at: row.created_at.toISOString(),
    updated_at: row.updated_at.toISOString(),
  };
}

export class PostgresPageStore implements CollectionRecordStore {
  private readonly db: NodePgDatabase;

  constructor(pool: Pool) {
    this.db = drizzle(pool);
  }

  async list(limit = 20, offset = 0): Promise<unknown[]> {
    const rows = await this.db
      .select()
      .from(jodkitPages)
      .orderBy(desc(jodkitPages.created_at))
      .limit(limit)
      .offset(offset);
    return rows.map(rowToRecord);
  }

  async get(id: string): Promise<unknown | undefined> {
    const rows = await this.db.select().from(jodkitPages).where(eq(jodkitPages.id, id));
    const row = rows[0];
    return row ? rowToRecord(row) : undefined;
  }

  async create(input: Record<string, unknown>): Promise<unknown> {
    const body: CreatePageInput = {
      slug: String(input.slug),
      title: String(input.title),
      body: String(input.body),
      status: String(input.status),
    };
    if (input.published_at !== undefined) {
      body.published_at = String(input.published_at);
    }
    try {
      const rows = await this.db
        .insert(jodkitPages)
        .values({
          slug: body.slug,
          title: body.title,
          body: body.body,
          status: body.status,
          published_at: body.published_at ? new Date(body.published_at) : null,
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

  async patch(id: string, input: Record<string, unknown>): Promise<unknown | undefined> {
    const existing = await this.get(id);
    if (!existing) return undefined;

    const patch: PatchPageInput = input;
    const updates: Partial<typeof jodkitPages.$inferInsert> = {
      updated_at: new Date(),
    };
    if (patch.slug !== undefined) updates.slug = patch.slug;
    if (patch.title !== undefined) updates.title = patch.title;
    if (patch.body !== undefined) updates.body = patch.body;
    if (patch.status !== undefined) updates.status = patch.status;
    if (patch.published_at !== undefined) {
      updates.published_at = patch.published_at ? new Date(patch.published_at) : null;
    }

    try {
      const rows = await this.db
        .update(jodkitPages)
        .set(updates)
        .where(eq(jodkitPages.id, id))
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
      .delete(jodkitPages)
      .where(eq(jodkitPages.id, id))
      .returning({ id: jodkitPages.id });
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
