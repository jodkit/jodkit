/** Generic CRUD contract for metadata-driven collections (REST/MCP). */
export interface CollectionRecordStore {
  list(limit?: number, offset?: number): Promise<unknown[]>;
  get(id: string): Promise<unknown | undefined>;
  create(input: Record<string, unknown>): Promise<unknown>;
  patch(id: string, input: Record<string, unknown>): Promise<unknown | undefined>;
  delete(id: string): Promise<boolean>;
}
