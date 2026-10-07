import type { FastifyInstance } from "fastify";

export type ModuleManifest = {
  id: string;
  version: string;
};

export type PlatformEvent = {
  name: string;
  payload?: unknown;
};

export type StorageProvider = {
  id: string;
  capabilityId: "storage";
  ping: () => Promise<{ ok: true; providerId: string }>;
};

export type ModuleContext = {
  kernel: KernelLike;
  app: FastifyInstance;
};

export type ModuleDefinition = {
  manifest: ModuleManifest;
  onEnable(ctx: ModuleContext): Promise<void>;
  onDisable?(ctx: ModuleContext): Promise<void>;
};

export type KernelLike = {
  capabilities: CapabilityRegistry;
  events: EventBus;
  registerModule(mod: ModuleDefinition): void;
  enableModule(id: string, ctx: ModuleContext): Promise<void>;
  disableModule(id: string, ctx: ModuleContext): Promise<void>;
  isModuleEnabled(id: string): boolean;
};

export type CapabilityRegistry = {
  register(provider: StorageProvider): void;
  resolveStorage(providerId?: string): StorageProvider | undefined;
  unregisterProvider(providerId: string): void;
};

export type EventBus = {
  on(name: string, handler: (event: PlatformEvent) => void | Promise<void>): void;
  off(name: string, handler: (event: PlatformEvent) => void | Promise<void>): void;
  emit(event: PlatformEvent): Promise<void>;
};
