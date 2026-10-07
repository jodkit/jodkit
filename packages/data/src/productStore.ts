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
export interface ProductStore {
  list(limit?: number, offset?: number): Promise<ProductRecord[]>;
  get(id: string): Promise<ProductRecord | undefined>;
  create(input: CreateProductInput): Promise<ProductRecord>;
  patch(id: string, input: PatchProductInput): Promise<ProductRecord | undefined>;
  delete(id: string): Promise<boolean>;
}
