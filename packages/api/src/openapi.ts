import type { CollectionDefinition } from "@jodkit/schema";

export type OpenApiDocument = {
  openapi: string;
  info: { title: string; version: string };
  paths: Record<string, unknown>;
};

export function buildOpenApiDoc(
  collections: readonly CollectionDefinition[],
  info: { title: string; version: string } = { title: "JodKit API", version: "0.1.0" },
): OpenApiDocument {
  const paths: Record<string, unknown> = {};

  for (const col of collections) {
    const base = `/api/${col.slug}`;
    const itemSchema = {
      type: "object",
      properties: Object.fromEntries(
        col.fields.map((f) => [f.name, { type: openApiType(f.type) }]),
      ),
    };

    paths[base] = {
      get: {
        summary: `List ${col.slug}`,
        parameters: [
          { name: "limit", in: "query", schema: { type: "integer" } },
          { name: "offset", in: "query", schema: { type: "integer" } },
        ],
        responses: { "200": { description: "OK" } },
      },
      post: {
        summary: `Create ${col.slug}`,
        requestBody: {
          required: true,
          content: { "application/json": { schema: itemSchema } },
        },
        responses: { "201": { description: "Created" } },
      },
    };

    paths[`${base}/{id}`] = {
      get: {
        summary: `Get ${col.slug} by id`,
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "OK" }, "404": { description: "Not found" } },
      },
      patch: {
        summary: `Patch ${col.slug}`,
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          content: { "application/json": { schema: { type: "object" } } },
        },
        responses: { "200": { description: "OK" }, "404": { description: "Not found" } },
      },
      delete: {
        summary: `Delete ${col.slug}`,
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { "204": { description: "No content" }, "404": { description: "Not found" } },
      },
    };
  }

  return {
    openapi: "3.1.0",
    info,
    paths,
  };
}

function openApiType(fieldType: string): string {
  switch (fieldType) {
    case "number":
      return "number";
    case "boolean":
      return "boolean";
    default:
      return "string";
  }
}
