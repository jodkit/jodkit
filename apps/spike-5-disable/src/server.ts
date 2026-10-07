import Fastify, { type FastifyInstance } from "fastify";
import { Kernel } from "./kernel/kernel.js";
import { disableDemoModule } from "./modules/disableDemoModule.js";

export type Spike5App = {
  app: FastifyInstance;
  kernel: Kernel;
};

export async function buildApp(): Promise<Spike5App> {
  const kernel = new Kernel();
  await kernel.boot();

  const app = Fastify({ logger: false });
  kernel.registerModule(disableDemoModule);

  app.addHook("onClose", async () => {
    await kernel.shutdown();
  });

  app.get("/health", async () => ({ ok: true, version: kernel.version }));

  return { app, kernel };
}

export async function enableDisableDemo(spike: Spike5App): Promise<void> {
  await spike.kernel.enableModule("disable-demo", { kernel: spike.kernel, app: spike.app });
}
