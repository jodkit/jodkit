import type { FastifyInstance } from "fastify";
import type { CollectionDefinition } from "../defineCollection.js";
import type { MemoryProductStore } from "../store/memoryStore.js";

export function registerCollectionRestRoutes(
  app: FastifyInstance,
  collection: CollectionDefinition,
  store: MemoryProductStore,
): void {
  const base = `/api/${collection.slug}`;

  app.get(base, async (req) => {
    const query = req.query as { limit?: string; offset?: string };
    const limit = Number(query.limit ?? 20);
    const offset = Number(query.offset ?? 0);
    return { data: store.list(limit, offset) };
  });

  app.get(`${base}/:id`, async (req, reply) => {
    const { id } = req.params as { id: string };
    const row = store.get(id);
    if (!row) {
      return reply.code(404).send({ error: { code: "NOT_FOUND", message: "Not found" } });
    }
    return row;
  });

  app.post(base, async (req, reply) => {
    const body = req.body as { name?: string; slug?: string; price?: number };
    if (!body.name || !body.slug || body.price === undefined) {
      return reply.code(400).send({ error: { code: "VALIDATION_ERROR", message: "Invalid body" } });
    }
    try {
      const created = store.create({
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
    const { id } = req.params as { id: string };
    const body = req.body as { name?: string; slug?: string; price?: number };
    try {
      const updated = store.patch(id, body);
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
    const { id } = req.params as { id: string };
    const ok = store.delete(id);
    if (!ok) {
      return reply.code(404).send({ error: { code: "NOT_FOUND", message: "Not found" } });
    }
    return reply.code(204).send();
  });
}
