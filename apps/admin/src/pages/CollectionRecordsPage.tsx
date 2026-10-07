import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchCollection, fetchRecords } from "../api/client.js";

export function CollectionRecordsPage() {
  const { slug = "" } = useParams();
  const [rows, setRows] = useState<Record<string, unknown>[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState(slug);

  useEffect(() => {
    if (!slug) return;
    Promise.all([fetchCollection(slug), fetchRecords(slug)])
      .then(([meta, data]) => {
        setTitle(meta?.slug ?? slug);
        setRows(data);
      })
      .catch((e: unknown) => setError(e instanceof Error ? e.message : "failed"));
  }, [slug]);

  const columns =
    rows.length > 0
      ? Object.keys(rows[0]!)
      : ["id", "slug", "title", "name", "email", "status", "created_at"];

  if (error) return <p className="error">Error: {error}</p>;

  return (
    <section>
      <p>
        <Link to="/">Collections</Link> / {title}
      </p>
      <h1>{title}</h1>
      <p>
        <Link to={`/collections/${slug}/new`}>Create record</Link>
      </p>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={String(row.id ?? i)}>
                {columns.map((col) => (
                  <td key={col}>{formatCell(row[col])}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 ? <p className="muted">No records yet.</p> : null}
      </div>
    </section>
  );
}

function formatCell(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}
