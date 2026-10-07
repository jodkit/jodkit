import { buildApp } from "./server.js";
import "./collections/products.js";

const host = process.env.HOST ?? "127.0.0.1";
const port = Number(process.env.PORT ?? 3001);

const { app } = await buildApp();
await app.listen({ host, port });
