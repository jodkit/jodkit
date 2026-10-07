import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchCollections } from "../api/client.js";
import type { AdminCollectionMeta } from "../lib/formFields.js";

export function CollectionsPage() {
  const [collections, setCollections] = useState<AdminCollectionMeta[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCollections()
      .then(setCollections)
      .catch((e: unknown) => setError(e instanceof Error ? e.message : "failed"));
  }, []);

  if (error) return <p className="error">Error: {error}</p>;

  return (
    <section>
      <h1>Collections</h1>
      <ul className="collection-list">
        {collections.map((c) => (
          <li key={c.slug}>
            <Link to={`/collections/${c.slug}`}>{c.slug}</Link>
            <span className="muted"> ({c.fields.length} fields)</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
