import type { AdminCollectionMeta } from "../lib/formFields.js";

const subject = import.meta.env.VITE_JODKIT_SUBJECT ?? "admin";

function headers(json = false): HeadersInit {
  const h: Record<string, string> = {
    "x-jodkit-subject": subject,
  };
  if (json) h["Content-Type"] = "application/json";
  return h;
}

export async function fetchCollections(): Promise<AdminCollectionMeta[]> {
  const res = await fetch("/admin/collections", { headers: headers() });
  if (!res.ok) throw new Error(`collections: ${res.status}`);
  const body = (await res.json()) as { data: AdminCollectionMeta[] };
  return body.data;
}

export async function fetchCollection(slug: string): Promise<AdminCollectionMeta | undefined> {
  const all = await fetchCollections();
  return all.find((c) => c.slug === slug);
}

export async function fetchRecords(slug: string, limit = 50): Promise<Record<string, unknown>[]> {
  const res = await fetch(`/api/${slug}?limit=${limit}`, { headers: headers() });
  if (!res.ok) throw new Error(`list ${slug}: ${res.status}`);
  return (await res.json()) as Record<string, unknown>[];
}

export async function createRecord(
  slug: string,
  payload: Record<string, unknown>,
): Promise<Record<string, unknown>> {
  const res = await fetch(`/api/${slug}`, {
    method: "POST",
    headers: headers(true),
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = (await res.json()) as { error?: unknown };
    throw new Error(JSON.stringify(err.error ?? res.status));
  }
  return (await res.json()) as Record<string, unknown>;
}

export async function fetchRelationOptions(
  relationTo: string,
): Promise<{ id: string; label: string }[]> {
  const rows = await fetchRecords(relationTo, 100);
  return rows.map((row) => {
    const id = String(row.id);
    const label =
      typeof row.title === "string"
        ? row.title
        : typeof row.slug === "string"
          ? row.slug
          : typeof row.name === "string"
            ? row.name
            : id;
    return { id, label };
  });
}
