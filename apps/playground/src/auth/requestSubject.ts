import type { FastifyRequest } from "fastify";

export function parseRequestSubject(req: FastifyRequest): string {
  const header = req.headers["x-jodkit-subject"];
  if (typeof header === "string" && header.trim()) {
    return header.trim();
  }

  const auth = req.headers.authorization;
  if (typeof auth === "string" && auth.startsWith("Bearer ")) {
    const token = auth.slice("Bearer ".length).trim();
    if (token) return token;
  }

  return "anonymous";
}
