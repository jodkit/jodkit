import type { CollectionRecordStore } from "@jodkit/data";
import { validateCollectionInput, type CollectionDefinition } from "@jodkit/schema";

export type McpTool = {
  name: string;
  description: string;
  handler: (args: Record<string, unknown>) => Promise<unknown>;
};

export type McpToolOptions = {
  isEnabled?: () => boolean;
  can?: (action: string) => Promise<boolean>;
};

export function buildMcpTools(
  collection: CollectionDefinition,
  store: CollectionRecordStore,
  options: McpToolOptions = {},
): McpTool[] {
  const gate = options.isEnabled ?? (() => true);
  const can = options.can ?? (async () => true);

  const assertEnabled = () => {
    if (!gate()) throw new Error("MODULE_DISABLED");
  };

  const assertCan = async (action: string) => {
    if (!(await can(action))) throw new Error("FORBIDDEN");
  };

  return [
    {
      name: `${collection.slug}_list`,
      description: `List ${collection.slug}`,
      handler: async (args) => {
        assertEnabled();
        await assertCan(`${collection.slug}:list`);
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
        await assertCan(`${collection.slug}:read`);
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
        await assertCan(`${collection.slug}:create`);
        const validated = validateCollectionInput(collection, args, "create");
        if (!validated.ok) {
          throw new Error(`VALIDATION_ERROR:${JSON.stringify(validated.errors)}`);
        }
        return store.create(validated.value);
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
