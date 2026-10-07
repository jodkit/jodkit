import { buildApp, enableDemoModule } from "./server.js";

const host = process.env.HOST ?? "127.0.0.1";
const port = Number(process.env.PORT ?? 3002);

const spike = await buildApp();
await enableDemoModule(spike);
await spike.app.listen({ host, port });
