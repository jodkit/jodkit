import Fastify, { type FastifyInstance } from "fastify";
import { Kernel } from "./kernel/kernel.js";
import { demoModule } from "./modules/demoModule.js";

export type Spike4App = {
  app: FastifyInstance;
  kernel: Kernel;
};

export async function buildApp(): Promise<Spike4App> {
  const kernel = new Kernel();
  await kernel.boot();

  const app = Fastify({ logger: false });
  kernel.registerModule(demoModule);

  app.addHook("onClose", async () => {
    await kernel.shutdown();
  });

  app.get("/health", async () => ({ ok: true, version: kernel.version }));

  return { app, kernel };
}

export async function enableDemoModule(spike: Spike4App): Promise<void> {
  await spike.kernel.enableModule("demo", { kernel: spike.kernel, app: spike.app });
}
