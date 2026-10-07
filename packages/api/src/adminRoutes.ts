import { getCollections } from "@jodkit/schema";
import type { FastifyInstance } from "fastify";

export type AdminRouteOptions = {
  can?: (action: string) => Promise<boolean>;
};

export function registerAdminCollectionRoutes(
  app: FastifyInstance,
  options: AdminRouteOptions = {},
): void {
  const can = options.can ?? (async () => true);

  app.get("/admin/collections", async (_req, reply) => {
    if (!(await can("admin:collections:read"))) {
      return reply.code(403).send({ error: "FORBIDDEN" });
    }
    const collections = getCollections().map((c) => ({
      slug: c.slug,
      tableName: c.tableName,
      fields: c.fields.map((f) => {
        const base = {
          name: f.name,
          type: f.type,
          required: f.required ?? false,
          unique: f.unique ?? false,
          primaryKey: f.primaryKey ?? false,
        };
        const withEnum =
          f.enum && f.enum.length > 0 ? { ...base, enum: [...f.enum] } : base;
        return f.relationTo
          ? { ...withEnum, relationTo: f.relationTo }
          : withEnum;
      }),
    }));
    return { data: collections };
  });
}
