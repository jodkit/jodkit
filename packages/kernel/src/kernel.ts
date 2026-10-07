import { createCapabilityRegistry } from "./capabilities.js";
import { createEventBus } from "./eventBus.js";
import { allowAllPermissionChecker } from "./permissions.js";
import type {
  KernelLike,
  ModuleContext,
  ModuleDefinition,
  PermissionChecker,
  PluginDefinition,
} from "./types.js";

export class Kernel implements KernelLike {
  readonly version = "0.1.0";
  readonly capabilities = createCapabilityRegistry();
  readonly events = createEventBus();

  private modules = new Map<string, ModuleDefinition>();
  private enabled = new Set<string>();
  private permissionChecker: PermissionChecker = allowAllPermissionChecker;

  registerModule(mod: ModuleDefinition): void {
    this.modules.set(mod.manifest.id, mod);
  }

  registerPlugin(plugin: PluginDefinition): void {
    this.registerModule(plugin);
  }

  setPermissionChecker(checker: PermissionChecker): void {
    this.permissionChecker = checker;
  }

  async can(action: string, resource?: string, subject = "anonymous"): Promise<boolean> {
    return this.permissionChecker.can(subject, action, resource);
  }

  isModuleEnabled(id: string): boolean {
    return this.enabled.has(id);
  }

  async enableModule(id: string, ctx: ModuleContext): Promise<void> {
    const mod = this.modules.get(id);
    if (!mod) throw new Error(`UNKNOWN_MODULE:${id}`);
    if (this.enabled.has(id)) return;
    await mod.onEnable(ctx);
    this.enabled.add(id);
    await this.events.emit({ name: "module.enabled", payload: { moduleId: id } });
  }

  async disableModule(id: string, ctx: ModuleContext): Promise<void> {
    const mod = this.modules.get(id);
    if (!mod || !this.enabled.has(id)) return;
    if (mod.onDisable) await mod.onDisable(ctx);
    this.enabled.delete(id);
    await this.events.emit({ name: "module.disabled", payload: { moduleId: id } });
  }

  async boot(): Promise<void> {}

  async shutdown(): Promise<void> {
    this.enabled.clear();
  }
}
