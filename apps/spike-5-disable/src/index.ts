import { buildApp, enableDisableDemo } from "./server.js";

const host = process.env.HOST ?? "127.0.0.1";
const port = Number(process.env.PORT ?? 3003);

const spike = await buildApp();
await enableDisableDemo(spike);
await spike.app.listen({ host, port });
