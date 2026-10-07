import { afterEach, describe, expect, it } from "vitest";
import { buildApp } from "./server.js";

describe("GET /health", () => {
  let app: Awaited<ReturnType<typeof buildApp>>["app"];

  afterEach(async () => {
    if (app) {
      await app.close();
    }
  });

  it("returns 200 with ok true and version", async () => {
    const built = await buildApp();
    app = built.app;

    const response = await app.inject({
      method: "GET",
      url: "/health",
    });

    expect(response.statusCode).toBe(200);
    const body = response.json() as { ok: boolean; version: string };
    expect(body.ok).toBe(true);
    expect(body.version).toBe("0.1.0");
  });
});
