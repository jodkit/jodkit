export type FieldType =
  | "uuid"
  | "string"
  | "text"
  | "number"
  | "boolean"
  | "datetime"
  | "json";

export type FieldDefinition = {
  name: string;
  type: FieldType;
  required?: boolean;
  unique?: boolean;
  primaryKey?: boolean;
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
