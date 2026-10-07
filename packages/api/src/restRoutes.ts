import type { ProductStore } from "@jodkit/data";
import type { CollectionDefinition } from "@jodkit/schema";
import type { FastifyInstance } from "fastify";

export type RestRouteOptions = {
  /** When false, collection routes return 503 MODULE_DISABLED (Spike 5 pattern). */
  isEnabled?: () => boolean;
};

export function registerCollectionRestRoutes(
  app: FastifyInstance,
  collection: CollectionDefinition,
  store: ProductStore,
  options: RestRouteOptions = {},
): void {
  const base = `/api/${collection.slug}`;
  const gate = options.isEnabled ?? (() => true);

  app.get(base, async (req, reply) => {
    if (!gate()) {
      return reply.code(503).send({ error: "MODULE_DISABLED" });
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
    const body = req.body as { name?: string; slug?: string; price?: number };
    if (!body.name || !body.slug || body.price === undefined) {
      return reply.code(400).send({ error: { code: "VALIDATION_ERROR", message: "Invalid body" } });
    }
    try {
      const created = await store.create({
        name: body.name,
        slug: body.slug,
        price: Number(body.price),
      });
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
    const { id } = req.params as { id: string };
    const body = req.body as { name?: string; slug?: string; price?: number };
    try {
      const updated = await store.patch(id, body);
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
    const { id } = req.params as { id: string };
    const ok = await store.delete(id);
    if (!ok) {
      return reply.code(404).send({ error: { code: "NOT_FOUND", message: "Not found" } });
    }
    return reply.code(204).send();
  });
}
