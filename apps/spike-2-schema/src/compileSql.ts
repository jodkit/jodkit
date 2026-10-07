import type { CollectionDefinition, FieldDefinition, FieldType } from "./defineCollection.js";

function pgType(field: FieldDefinition): string {
  const t: FieldType = field.type;
  switch (t) {
    case "uuid":
      return "uuid";
    case "string":
      return "text";
    case "text":
      return "text";
    case "number":
      return "numeric";
    case "boolean":
      return "boolean";
    case "datetime":
      return "timestamptz";
    case "json":
      return "jsonb";
    default: {
      const _exhaustive: never = t;
      return _exhaustive;
    }
  }
}

function columnDef(field: FieldDefinition): string {
  const parts: string[] = [`"${field.name}"`, pgType(field)];

  if (field.primaryKey) {
    parts.push("PRIMARY KEY");
    if (field.type === "uuid") {
      parts.push("DEFAULT gen_random_uuid()");
    }
  } else if (field.required) {
    parts.push("NOT NULL");
  }

  if (field.unique && !field.primaryKey) {
    parts.push("UNIQUE");
  }

  if (field.name === "created_at" || field.name === "updated_at") {
    if (!field.primaryKey) {
      parts.push("DEFAULT now()");
    }
  }

  return parts.join(" ");
}

export function compileCreateTable(collection: CollectionDefinition): string {
  const table = collection.tableName ?? `jodkit_${collection.slug}`;
  const columns = collection.fields.map((f) => `  ${columnDef(f)}`).join(",\n");

  return `-- Generated from defineCollection("${collection.slug}")\nCREATE TABLE IF NOT EXISTS "${table}" (\n${columns}\n);\n`;
}

export function compileMigrationForCollections(
  collections: readonly CollectionDefinition[],
): string {
  return collections.map((c) => compileCreateTable(c)).join("\n");
}
