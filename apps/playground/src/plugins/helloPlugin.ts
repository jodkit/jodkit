import type { PluginDefinition } from "@jodkit/kernel";
import type { FastifyInstance } from "fastify";

export const HELLO_PLUGIN_ID = "hello-plugin";
export const HELLO_PING_PATH = "/plugins/hello/ping";
export const HELLO_PING_ACTION = "hello:ping";

const appsWithHelloRoute = new WeakSet<FastifyInstance>();

export const helloPlugin: PluginDefinition = {
  manifest: {
    id: HELLO_PLUGIN_ID,
    version: "0.1.0",
    permissions: [{ key: HELLO_PING_ACTION, description: "Call hello plugin ping route" }],
  },

  async onEnable(ctx) {
    if (appsWithHelloRoute.has(ctx.app)) return;
    appsWithHelloRoute.add(ctx.app);

    ctx.app.get(HELLO_PING_PATH, async (_req, reply) => {
      if (!ctx.kernel.isModuleEnabled(HELLO_PLUGIN_ID)) {
        return reply.code(503).send({ error: "MODULE_DISABLED" });
      }
      if (!(await ctx.kernel.can(HELLO_PING_ACTION))) {
        return reply.code(403).send({ error: "FORBIDDEN" });
      }
      return { ok: true, pluginId: HELLO_PLUGIN_ID };
    });
  },
};
