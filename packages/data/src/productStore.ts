import type { CollectionRecordStore } from "./collectionStore.js";

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

/** Collection-backed store contract for API and MCP (walking skeleton). */
export interface ProductStore extends CollectionRecordStore {
  list(limit?: number, offset?: number): Promise<ProductRecord[]>;
  get(id: string): Promise<ProductRecord | undefined>;
  create(input: CreateProductInput | Record<string, unknown>): Promise<ProductRecord>;
  patch(id: string, input: PatchProductInput | Record<string, unknown>): Promise<ProductRecord | undefined>;
  delete(id: string): Promise<boolean>;
}
