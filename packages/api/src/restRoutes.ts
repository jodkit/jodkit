import type { ProductStore } from "@jodkit/data";
import {
  asProductCreateInput,
  asProductPatchInput,
  validateCollectionInput,
  type CollectionDefinition,
} from "@jodkit/schema";
import type { FastifyInstance } from "fastify";

export type RestRouteOptions = {
  /** When false, collection routes return 503 MODULE_DISABLED (Spike 5 pattern). */
  isEnabled?: () => boolean;
  /** v0.1 permission hook: return false to respond 403 FORBIDDEN. */
  can?: (action: string) => Promise<boolean>;
};

export function registerCollectionRestRoutes(
  app: FastifyInstance,
  collection: CollectionDefinition,
  store: ProductStore,
  options: RestRouteOptions = {},
): void {
  const base = `/api/${collection.slug}`;
  const gate = options.isEnabled ?? (() => true);
  const can = options.can ?? (async () => true);

  app.get(base, async (req, reply) => {
    if (!gate()) {
      return reply.code(503).send({ error: "MODULE_DISABLED" });
    }
    if (!(await can(`${collection.slug}:list`))) {
      return reply.code(403).send({ error: "FORBIDDEN" });
    }
    const query = req.query as { limit?: string; offset?: string };
    const limit = Number(query.limit ?? 20);
    const offset = Number(query.offset ?? 0);
    return { data: await store.list(limit, offset) };
  });

  app.get(`${base}/:id`, async (req, reply) => {
    if (!gate()) {
      return reply.code(503).send({ error: "MODULE_DISABLED" });
    }
    if (!(await can(`${collection.slug}:read`))) {
      return reply.code(403).send({ error: "FORBIDDEN" });
    }
    const { id } = req.params as { id: string };
    const row = await store.get(id);
    if (!row) {
      return reply.code(404).send({ error: { code: "NOT_FOUND", message: "Not found" } });
    }
    return row;
  });

  app.post(base, async (req, reply) => {
    if (!gate()) {
      return reply.code(503).send({ error: "MODULE_DISABLED" });
    }
    if (!(await can(`${collection.slug}:create`))) {
      return reply.code(403).send({ error: "FORBIDDEN" });
    }
    const validated = validateCollectionInput(collection, req.body, "create");
    if (!validated.ok) {
      return reply.code(400).send({
        error: { code: "VALIDATION_ERROR", message: "Invalid body", details: validated.errors },
      });
    }
    try {
      const created = await store.create(asProductCreateInput(validated.value));
      return reply.code(201).send(created);
    } catch (e) {
      if (e instanceof Error && e.message.startsWith("CONFLICT")) {
        return reply.code(409).send({ error: { code: "CONFLICT", message: e.message } });
      }
      throw e;
    }
  });

  app.patch(`${base}/:id`, async (req, reply) => {
    if (!gate()) {
      return reply.code(503).send({ error: "MODULE_DISABLED" });
    }
    if (!(await can(`${collection.slug}:update`))) {
      return reply.code(403).send({ error: "FORBIDDEN" });
    }
    const { id } = req.params as { id: string };
    const validated = validateCollectionInput(collection, req.body, "patch");
    if (!validated.ok) {
      return reply.code(400).send({
        error: { code: "VALIDATION_ERROR", message: "Invalid body", details: validated.errors },
      });
    }
    try {
      const updated = await store.patch(id, asProductPatchInput(validated.value));
      if (!updated) {
        return reply.code(404).send({ error: { code: "NOT_FOUND", message: "Not found" } });
      }
      return updated;
    } catch (e) {
      if (e instanceof Error && e.message.startsWith("CONFLICT")) {
        return reply.code(409).send({ error: { code: "CONFLICT", message: e.message } });
      }
      throw e;
    }
  });

  app.delete(`${base}/:id`, async (req, reply) => {
    if (!gate()) {
      return reply.code(503).send({ error: "MODULE_DISABLED" });
    }
    if (!(await can(`${collection.slug}:delete`))) {
      return reply.code(403).send({ error: "FORBIDDEN" });
    }
    const { id } = req.params as { id: string };
    const ok = await store.delete(id);
    if (!ok) {
      return reply.code(404).send({ error: { code: "NOT_FOUND", message: "Not found" } });
    }
    return reply.code(204).send();
  });
}
