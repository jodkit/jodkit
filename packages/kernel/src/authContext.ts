import { AsyncLocalStorage } from "node:async_hooks";

export type RequestAuthStore = {
  subject: string;
};

const storage = new AsyncLocalStorage<RequestAuthStore>();

export function runWithRequestAuth<T>(subject: string, fn: () => T): T {
  return storage.run({ subject }, fn);
}

export function getRequestSubject(): string {
  return storage.getStore()?.subject ?? "anonymous";
}

/** For tests and Fastify onRequest hooks. */
export function enterRequestAuth(subject: string): void {
  storage.enterWith({ subject });
}
