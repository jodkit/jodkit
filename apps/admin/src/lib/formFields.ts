export type AdminFieldMeta = {
  name: string;
  type: string;
  required?: boolean;
  primaryKey?: boolean;
  enum?: string[];
  relationTo?: string;
};

export type AdminCollectionMeta = {
  slug: string;
  tableName?: string;
  fields: AdminFieldMeta[];
};

const READ_ONLY_ON_CREATE = new Set(["id", "created_at", "updated_at"]);

/** Fields shown on metadata-driven create forms. */
export function fieldsForCreateForm(collection: AdminCollectionMeta): AdminFieldMeta[] {
  return collection.fields.filter(
    (f) => !f.primaryKey && !READ_ONLY_ON_CREATE.has(f.name) && f.type !== "uuid",
  );
}
