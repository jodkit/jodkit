# JodKit platform contracts (conceptual)

**Status:** Pre-code interface definitions. Not runnable TypeScript in repo yet.

**Rule:** Core defines these contracts. Modules and plugins implement them. **Fastify, Drizzle, and vendor SDKs must not become the public extension API.**

Related: [data-model.md](../data-model.md) | [providers.md](../providers.md) | [ADR-001](../research/adr-001-drizzle-data-layer.md)

---

## Module

```ts
interface ModuleManifest {
  id: string
  version: string
  requires?: Record<string, string> // semver range on platform or modules
  capabilities?: string[] // capability IDs this module registers or consumes
}

interface Module {
  manifest: ModuleManifest
  onInstall?(ctx: KernelContext): Promise<void>
  onEnable?(ctx: KernelContext): Promise<void>
  onDisable?(ctx: KernelContext): Promise<void>
  onUninstall?(ctx: KernelContext): Promise<void>
  registerCollections?(registry: CollectionRegistry): void
  registerRoutes?(app: HttpRegistrar, ctx: KernelContext): void
  registerEvents?(bus: EventBus): void
  registerMigrations?(migrations: MigrationRegistry): void
}
```

Disabled modules: `register*` outputs must not be active (see [implementation-spikes.md](../research/implementation-spikes.md#spike-5-disabled-module)).

---

## Plugin

```ts
interface PluginManifest extends ModuleManifest {
  permissions?: PermissionDeclaration[]
  provides?: ProviderRegistration[]
}

interface Plugin extends Module {
  manifest: PluginManifest
}
```

Plugins **may register migrations** and **own database tables** with a platform-assigned table prefix ([data-model.md](../data-model.md)).

---

## Capability and Provider

```ts
interface Capability {
  id: string // e.g. "payment", "storage"
  contractVersion: string // e.g. "1.0"
}

interface ProviderRegistration {
  capabilityId: string
  providerId: string
  contract: string // e.g. "PaymentProvider"
}

interface Provider<TContract = unknown> {
  id: string
  capabilityId: string
  contractVersion: string
  // TContract defines methods - see per-capability interfaces in future packages
}
```

Resolution: `kernel.capabilities.resolve<T>("payment", providerId?)` - never import vendor by name in core.

Example IDs: [.ai/capabilities.json](../../.ai/capabilities.json).

---

## Collection and Field

```ts
type FieldType =
  | "string"
  | "text"
  | "number"
  | "boolean"
  | "datetime"
  | "json"
  // v0.1: expand minimally; ~8 types before admin UI

interface FieldDefinition {
  name: string
  type: FieldType
  required?: boolean
  unique?: boolean
  default?: unknown
}

interface CollectionDefinition {
  slug: string // API path segment e.g. "products"
  tableName?: string // default derived with prefix rules
  fields: FieldDefinition[]
  permissions?: CollectionPermissions
}

interface CollectionPermissions {
  create?: string // permission key
  read?: string
  update?: string
  delete?: string
}
```

`defineCollection(def: CollectionDefinition)` registers metadata only; generators produce REST, OpenAPI, MCP ([api-contract.md](../api-contract.md)).

---

## Event, Hook, Filter

```ts
interface PlatformEvent<TPayload = unknown> {
  name: string // e.g. "product.created"
  payload: TPayload
  meta?: { moduleId?: string; requestId?: string }
}

interface EventBus {
  on(name: string, handler: (event: PlatformEvent) => void | Promise<void>): void
  emit(event: PlatformEvent): Promise<void>
}

// Filters transform a value; hooks run side effects - v0.1 may implement events only
type FilterHandler<T> = (value: T, context: KernelContext) => T | Promise<T>
```

---

## Permission

```ts
interface PermissionDeclaration {
  key: string // e.g. "db.read"
  description: string
}

interface PermissionChecker {
  can(subject: string, action: string, resource?: string): Promise<boolean>
}
```

v0.1: declarations are **metadata**; in-process plugins are not sandboxed ([stack-direction-v0.2.md](../research/stack-direction-v0.2.md#9-plugin-trusted-plugins-permission-declarations-proposed)).

---

## Data Layer (boundary)

Plugins use this interface - not raw Drizzle in public extension code.

```ts
interface DataLayer {
  query<T>(fn: (db: DbSession) => Promise<T>): Promise<T>
  execute(sql: TaggedSql): Promise<unknown>
}

interface MigrationRegistry {
  register(moduleId: string, migrations: MigrationBundle): void
}

interface MigrationBundle {
  id: string
  up(): Promise<void>
  down?(): Promise<void>
}
```

---

## Storage and Queue (stubs v0.1)

```ts
interface StorageProvider {
  id: string
  put(path: string, body: Buffer | ReadableStream): Promise<void>
  get(path: string): Promise<Buffer | null>
  delete(path: string): Promise<void>
}

interface QueueProvider {
  id: string
  enqueue(jobName: string, payload: unknown): Promise<string>
}
```

Implementations deferred past walking skeleton unless spike needs queue.

---

## KernelContext

```ts
interface KernelContext {
  config: AppConfig
  capabilities: CapabilityRegistry
  collections: CollectionRegistry
  events: EventBus
  permissions: PermissionChecker
  data: DataLayer
  logger: Logger
}
```

---

## HttpRegistrar

Abstraction over Fastify route registration so modules do not depend on Fastify types in public manifests (internal packages may use Fastify directly).

```ts
interface HttpRegistrar {
  get(path: string, handler: RouteHandler): void
  post(path: string, handler: RouteHandler): void
  patch(path: string, handler: RouteHandler): void
  delete(path: string, handler: RouteHandler): void
}
```

---

## Versioning

Manifest semver and `requires` ranges: [compatibility.md](../compatibility.md).
