import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { createRecord, fetchCollection } from "../api/client.js";
import { FieldInput } from "../components/FieldInput.js";
import { fieldsForCreateForm, type AdminCollectionMeta } from "../lib/formFields.js";

export function CollectionCreatePage() {
  const { slug = "" } = useParams();
  const navigate = useNavigate();
  const [meta, setMeta] = useState<AdminCollectionMeta | null>(null);
  const [values, setValues] = useState<Record<string, unknown>>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    fetchCollection(slug)
      .then((c) => {
        if (c) setMeta(c);
      })
      .catch((e: unknown) => setError(e instanceof Error ? e.message : "failed"));
  }, [slug]);

  const formFields = meta ? fieldsForCreateForm(meta) : [];

  function onChange(name: string, value: unknown) {
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!slug) return;
    setError(null);
    const payload: Record<string, unknown> = {};
    for (const field of formFields) {
      const v = values[field.name];
      if (v === "" || v === undefined) {
        if (field.required) {
          setError(`${field.name} is required`);
          return;
        }
        continue;
      }
      payload[field.name] = v;
    }
    try {
      await createRecord(slug, payload);
      navigate(`/collections/${slug}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "create failed");
    }
  }

  if (!meta && !error) return <p>Loading...</p>;

  return (
    <section>
      <p>
        <Link to="/">Collections</Link> /{" "}
        <Link to={`/collections/${slug}`}>{slug}</Link> / new
      </p>
      <h1>Create {slug}</h1>
      {error ? <p className="error">{error}</p> : null}
      <form onSubmit={onSubmit} className="create-form">
        {formFields.map((field) => (
          <FieldInput key={field.name} field={field} value={values[field.name]} onChange={onChange} />
        ))}
        <button type="submit">Create</button>
      </form>
    </section>
  );
}
