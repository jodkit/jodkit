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

export type PermissionChecker = {
  can(subject: string, action: string, resource?: string): Promise<boolean>;
};

export type PermissionDeclaration = {
  key: string;
  description: string;
};

export type PluginManifest = ModuleManifest & {
  permissions?: PermissionDeclaration[];
};

export type PluginDefinition = ModuleDefinition & {
  manifest: PluginManifest;
};

export type KernelLike = {
  version: string;
  capabilities: CapabilityRegistry;
  events: EventBus;
  registerModule(mod: ModuleDefinition): void;
  registerPlugin(plugin: PluginDefinition): void;
  enableModule(id: string, ctx: ModuleContext): Promise<void>;
  disableModule(id: string, ctx: ModuleContext): Promise<void>;
  isModuleEnabled(id: string): boolean;
  setPermissionChecker(checker: PermissionChecker): void;
  can(action: string, resource?: string, subject?: string): Promise<boolean>;
  boot(): Promise<void>;
  shutdown(): Promise<void>;
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
