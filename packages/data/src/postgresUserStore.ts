import { desc, eq } from "drizzle-orm";
import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import type { Pool } from "pg";
import type { CollectionRecordStore } from "./collectionStore.js";
import { jodkitUsers } from "./tables/users.js";
import type { CreateUserInput, PatchUserInput, UserRecord } from "./userStore.js";

function rowToRecord(row: typeof jodkitUsers.$inferSelect): UserRecord {
  return {
    id: row.id,
    email: row.email,
    display_name: row.display_name,
    created_at: row.created_at.toISOString(),
    updated_at: row.updated_at.toISOString(),
  };
}

export class PostgresUserStore implements CollectionRecordStore {
  private readonly db: NodePgDatabase;

  constructor(pool: Pool) {
    this.db = drizzle(pool);
  }

  async list(limit = 20, offset = 0): Promise<unknown[]> {
    const rows = await this.db
      .select()
      .from(jodkitUsers)
      .orderBy(desc(jodkitUsers.created_at))
      .limit(limit)
      .offset(offset);
    return rows.map(rowToRecord);
  }

  async get(id: string): Promise<unknown | undefined> {
    const rows = await this.db.select().from(jodkitUsers).where(eq(jodkitUsers.id, id));
    const row = rows[0];
    return row ? rowToRecord(row) : undefined;
  }

  async create(input: Record<string, unknown>): Promise<unknown> {
    const body: CreateUserInput = {
      email: String(input.email),
      display_name: String(input.display_name),
    };
    try {
      const rows = await this.db.insert(jodkitUsers).values(body).returning();
      const row = rows[0];
      if (!row) throw new Error("INSERT_FAILED");
      return rowToRecord(row);
    } catch (e) {
      if (isPgUniqueViolation(e)) {
        throw new Error("CONFLICT: email exists");
      }
      throw e;
    }
  }

  async patch(id: string, input: Record<string, unknown>): Promise<unknown | undefined> {
    const existing = await this.get(id);
    if (!existing) return undefined;

    const updates: Partial<typeof jodkitUsers.$inferInsert> = {
      updated_at: new Date(),
    };
    if (input.email !== undefined) updates.email = String(input.email);
    if (input.display_name !== undefined) updates.display_name = String(input.display_name);

    try {
      const rows = await this.db
        .update(jodkitUsers)
        .set(updates)
        .where(eq(jodkitUsers.id, id))
        .returning();
      const row = rows[0];
      return row ? rowToRecord(row) : undefined;
    } catch (e) {
      if (isPgUniqueViolation(e)) {
        throw new Error("CONFLICT: email exists");
      }
      throw e;
    }
  }

  async delete(id: string): Promise<boolean> {
    const rows = await this.db
      .delete(jodkitUsers)
      .where(eq(jodkitUsers.id, id))
      .returning({ id: jodkitUsers.id });
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
