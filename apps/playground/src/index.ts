import { buildPlaygroundApp, enableWalkingSkeletonModules } from "./app.js";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL is required");
  process.exit(1);
}

const host = process.env.HOST ?? "127.0.0.1";
const port = Number(process.env.PORT ?? 3010);

const playground = await buildPlaygroundApp(url);
await enableWalkingSkeletonModules(playground);
await playground.app.listen({ host, port });
