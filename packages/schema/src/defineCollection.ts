export type FieldType =
  | "uuid"
  | "string"
  | "text"
  | "number"
  | "money"
  | "boolean"
  | "datetime"
  | "json"
  | "relation";

export type FieldDefinition = {
  name: string;
  type: FieldType;
  required?: boolean;
  unique?: boolean;
  primaryKey?: boolean;
  /** Allowed values for string/text fields (metadata validation only). */
  enum?: string[];
  /** Target collection slug for relation fields. */
  relationTo?: string;
};

export type CollectionDefinition = {
  slug: string;
  tableName?: string;
  fields: FieldDefinition[];
};

const collections: CollectionDefinition[] = [];

export function defineCollection(def: CollectionDefinition): CollectionDefinition {
  const normalized: CollectionDefinition = {
    ...def,
    tableName: def.tableName ?? `jodkit_${def.slug}`,
  };
  collections.push(normalized);
  return normalized;
}

export function getCollections(): readonly CollectionDefinition[] {
  return collections;
}

export function resetCollectionsForTests(): void {
  collections.length = 0;
}
