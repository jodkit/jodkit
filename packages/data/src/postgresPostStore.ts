import { desc, eq } from "drizzle-orm";
import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import type { Pool } from "pg";
import type { CollectionRecordStore } from "./collectionStore.js";
import type { CreatePostInput, PatchPostInput, PostRecord } from "./postStore.js";
import { jodkitPosts } from "./tables/posts.js";

function rowToRecord(row: typeof jodkitPosts.$inferSelect): PostRecord {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    body: row.body,
    page_id: row.page_id,
    created_at: row.created_at.toISOString(),
    updated_at: row.updated_at.toISOString(),
  };
}

export class PostgresPostStore implements CollectionRecordStore {
  private readonly db: NodePgDatabase;

  constructor(pool: Pool) {
    this.db = drizzle(pool);
  }

  async list(limit = 20, offset = 0): Promise<unknown[]> {
    const rows = await this.db
      .select()
      .from(jodkitPosts)
      .orderBy(desc(jodkitPosts.created_at))
      .limit(limit)
      .offset(offset);
    return rows.map(rowToRecord);
  }

  async get(id: string): Promise<unknown | undefined> {
    const rows = await this.db.select().from(jodkitPosts).where(eq(jodkitPosts.id, id));
    const row = rows[0];
    return row ? rowToRecord(row) : undefined;
  }

  async create(input: Record<string, unknown>): Promise<unknown> {
    const body: CreatePostInput = {
      slug: String(input.slug),
      title: String(input.title),
      body: String(input.body),
      page_id: String(input.page_id),
    };
    try {
      const rows = await this.db.insert(jodkitPosts).values(body).returning();
      const row = rows[0];
      if (!row) throw new Error("INSERT_FAILED");
      return rowToRecord(row);
    } catch (e) {
      if (isPgUniqueViolation(e)) {
        throw new Error("CONFLICT: slug exists");
      }
      if (isPgForeignKeyViolation(e)) {
        throw new Error("CONFLICT: invalid page_id");
      }
      throw e;
    }
  }

  async patch(id: string, input: Record<string, unknown>): Promise<unknown | undefined> {
    const existing = await this.get(id);
    if (!existing) return undefined;

    const patch: PatchPostInput = input;
    const updates: Partial<typeof jodkitPosts.$inferInsert> = {
      updated_at: new Date(),
    };
    if (patch.slug !== undefined) updates.slug = patch.slug;
    if (patch.title !== undefined) updates.title = patch.title;
    if (patch.body !== undefined) updates.body = patch.body;
    if (patch.page_id !== undefined) updates.page_id = patch.page_id;

    try {
      const rows = await this.db
        .update(jodkitPosts)
        .set(updates)
        .where(eq(jodkitPosts.id, id))
        .returning();
      const row = rows[0];
      return row ? rowToRecord(row) : undefined;
    } catch (e) {
      if (isPgUniqueViolation(e)) {
        throw new Error("CONFLICT: slug exists");
      }
      if (isPgForeignKeyViolation(e)) {
        throw new Error("CONFLICT: invalid page_id");
      }
      throw e;
    }
  }

  async delete(id: string): Promise<boolean> {
    const rows = await this.db
      .delete(jodkitPosts)
      .where(eq(jodkitPosts.id, id))
      .returning({ id: jodkitPosts.id });
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

function isPgForeignKeyViolation(err: unknown): boolean {
  return (
    typeof err === "object" &&
    err !== null &&
    "code" in err &&
    (err as { code: string }).code === "23503"
  );
}
