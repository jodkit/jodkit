import type { ProductStore } from "@jodkit/data";
import type { CollectionDefinition } from "@jodkit/schema";

export type McpTool = {
  name: string;
  description: string;
  handler: (args: Record<string, unknown>) => Promise<unknown>;
};

export function buildMcpTools(
  collection: CollectionDefinition,
  store: ProductStore,
  options: { isEnabled?: () => boolean } = {},
): McpTool[] {
  const gate = options.isEnabled ?? (() => true);

  if (collection.slug !== "products") {
    return [];
  }

  const assertEnabled = () => {
    if (!gate()) throw new Error("MODULE_DISABLED");
  };

  return [
    {
      name: `${collection.slug}_list`,
      description: `List ${collection.slug}`,
      handler: async (args) => {
        assertEnabled();
        const limit = Number(args.limit ?? 20);
        const offset = Number(args.offset ?? 0);
        return store.list(limit, offset);
      },
    },
    {
      name: `${collection.slug}_get`,
      description: `Get ${collection.slug} by id`,
      handler: async (args) => {
        assertEnabled();
        const id = String(args.id ?? "");
        const row = await store.get(id);
        if (!row) throw new Error("NOT_FOUND");
        return row;
      },
    },
    {
      name: `${collection.slug}_create`,
      description: `Create ${collection.slug}`,
      handler: async (args) => {
        assertEnabled();
        const name = String(args.name ?? "");
        const slug = String(args.slug ?? "");
        const price = Number(args.price);
        return store.create({ name, slug, price });
      },
    },
  ];
}

export async function invokeTool(
  tools: McpTool[],
  name: string,
  args: Record<string, unknown>,
): Promise<unknown> {
  const tool = tools.find((t) => t.name === name);
  if (!tool) throw new Error("UNKNOWN_TOOL");
  return tool.handler(args);
}
