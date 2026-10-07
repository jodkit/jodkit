import Fastify, { type FastifyInstance } from "fastify";
import { Kernel } from "./kernel.js";

export type SpikeApp = {
  app: FastifyInstance;
  kernel: Kernel;
};

export async function buildApp(): Promise<SpikeApp> {
  const kernel = new Kernel();
  await kernel.boot();

  const app = Fastify({ logger: false });

  app.get("/health", async () => ({
    ok: true,
    version: kernel.version,
  }));

  app.addHook("onClose", async () => {
    await kernel.shutdown();
  });

  return { app, kernel };
}
