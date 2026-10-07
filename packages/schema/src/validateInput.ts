import type { CollectionDefinition, FieldDefinition } from "./defineCollection.js";

export type ValidationError = {
  field: string;
  code: string;
  message: string;
};

export type ValidateCreateResult =
  | { ok: true; value: Record<string, unknown> }
  | { ok: false; errors: ValidationError[] };

export type ValidatePatchResult = ValidateCreateResult;

const READ_ONLY_ON_CREATE = new Set(["id", "created_at", "updated_at"]);

function isReadOnlyOnCreate(field: FieldDefinition): boolean {
  return field.primaryKey === true || READ_ONLY_ON_CREATE.has(field.name);
}

function isReadOnlyFieldName(name: string, field?: FieldDefinition): boolean {
  if (field) return isReadOnlyOnCreate(field);
  return READ_ONLY_ON_CREATE.has(name);
}

function mutableFieldNames(collection: CollectionDefinition): string[] {
  return collection.fields.filter((f) => !isReadOnlyOnCreate(f)).map((f) => f.name);
}

function validateFieldValue(
  field: FieldDefinition,
  raw: unknown,
): ValidationError | undefined {
  if (raw === undefined || raw === null) {
    return { field: field.name, code: "REQUIRED", message: `${field.name} is required` };
  }

  switch (field.type) {
    case "number": {
      const n = typeof raw === "number" ? raw : Number(raw);
      if (Number.isNaN(n)) {
        return { field: field.name, code: "INVALID_TYPE", message: `${field.name} must be a number` };
      }
      return undefined;
    }
    case "boolean": {
      if (typeof raw !== "boolean") {
        return { field: field.name, code: "INVALID_TYPE", message: `${field.name} must be a boolean` };
      }
      return undefined;
    }
    case "uuid":
    case "string":
    case "text":
    case "datetime":
    case "json": {
      if (typeof raw !== "string" || raw.trim() === "") {
        return {
          field: field.name,
          code: field.type === "string" || field.type === "text" ? "REQUIRED" : "INVALID_TYPE",
          message: `${field.name} must be a non-empty string`,
        };
      }
      return undefined;
    }
    default:
      return undefined;
  }
}

function coerceFieldValue(field: FieldDefinition, raw: unknown): unknown {
  if (field.type === "number") {
    return typeof raw === "number" ? raw : Number(raw);
  }
  return raw;
}

export function validateCollectionInput(
  collection: CollectionDefinition,
  body: unknown,
  mode: "create" | "patch",
): ValidateCreateResult | ValidatePatchResult {
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return {
      ok: false,
      errors: [{ field: "_body", code: "INVALID_BODY", message: "Body must be an object" }],
    };
  }

  const input = body as Record<string, unknown>;
  const errors: ValidationError[] = [];
  const mutable = new Set(mutableFieldNames(collection));
  const fieldByName = new Map(collection.fields.map((f) => [f.name, f]));

  if (mode === "create") {
    for (const key of Object.keys(input)) {
      if (isReadOnlyFieldName(key, fieldByName.get(key))) {
        errors.push({
          field: key,
          code: "READ_ONLY",
          message: `${key} cannot be set on create`,
        });
      }
    }

    for (const field of collection.fields) {
      if (isReadOnlyOnCreate(field)) continue;
      if (!field.required) continue;
      const err = validateFieldValue(field, input[field.name]);
      if (err) errors.push(err);
    }

    if (errors.length > 0) return { ok: false, errors };

    const value: Record<string, unknown> = {};
    for (const name of mutable) {
      const field = fieldByName.get(name);
      if (!field || input[name] === undefined) continue;
      value[name] = coerceFieldValue(field, input[name]);
    }
    for (const field of collection.fields) {
      if (isReadOnlyOnCreate(field)) continue;
      if (field.required && value[field.name] === undefined) {
        return {
          ok: false,
          errors: [{ field: field.name, code: "REQUIRED", message: `${field.name} is required` }],
        };
      }
    }

    return { ok: true, value };
  }

  // patch
  const patchKeys = Object.keys(input).filter((k) => mutable.has(k));
  if (patchKeys.length === 0) {
    return {
      ok: false,
      errors: [{ field: "_body", code: "EMPTY_PATCH", message: "At least one field required" }],
    };
  }

  for (const key of Object.keys(input)) {
    if (!mutable.has(key)) {
      if (isReadOnlyFieldName(key, fieldByName.get(key))) {
        errors.push({
          field: key,
          code: "READ_ONLY",
          message: `${key} cannot be patched directly`,
        });
      }
    }
  }

  for (const key of patchKeys) {
    const field = fieldByName.get(key)!;
    const err = validateFieldValue(field, input[key]);
    if (err) errors.push(err);
  }

  if (errors.length > 0) return { ok: false, errors };

  const value: Record<string, unknown> = {};
  for (const key of patchKeys) {
    const field = fieldByName.get(key)!;
    value[key] = coerceFieldValue(field, input[key]);
  }

  return { ok: true, value };
}

/** Products create shape for typed store calls. */
export function asProductCreateInput(value: Record<string, unknown>): {
  name: string;
  slug: string;
  price: number;
} {
  return {
    name: String(value.name),
    slug: String(value.slug),
    price: Number(value.price),
  };
}

export function asProductPatchInput(value: Record<string, unknown>): {
  name?: string;
  slug?: string;
  price?: number;
} {
  const out: { name?: string; slug?: string; price?: number } = {};
  if (value.name !== undefined) out.name = String(value.name);
  if (value.slug !== undefined) out.slug = String(value.slug);
  if (value.price !== undefined) out.price = Number(value.price);
  return out;
}
