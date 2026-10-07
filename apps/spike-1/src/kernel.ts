export class Kernel {
  readonly version = "0.1.0";

  async boot(): Promise<void> {
    // Spike 1: lifecycle hook only; no DB, modules, or providers yet.
  }

  async shutdown(): Promise<void> {
    // Spike 1: lifecycle hook only.
  }
}
