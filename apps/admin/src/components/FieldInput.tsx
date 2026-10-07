import { useEffect, useState } from "react";
import type { AdminFieldMeta } from "../lib/formFields.js";
import { fetchRelationOptions } from "../api/client.js";

type Props = {
  field: AdminFieldMeta;
  value: unknown;
  onChange: (name: string, value: unknown) => void;
};

export function FieldInput({ field, value, onChange }: Props) {
  const [relationOptions, setRelationOptions] = useState<{ id: string; label: string }[]>([]);
  const [relationError, setRelationError] = useState<string | null>(null);

  useEffect(() => {
    if (field.type !== "relation" || !field.relationTo) return;
    let cancelled = false;
    fetchRelationOptions(field.relationTo)
      .then((opts) => {
        if (!cancelled) setRelationOptions(opts);
      })
      .catch((e: unknown) => {
        if (!cancelled) setRelationError(e instanceof Error ? e.message : "load failed");
      });
    return () => {
      cancelled = true;
    };
  }, [field.type, field.relationTo]);

  const id = `field-${field.name}`;
  const label = (
    <label htmlFor={id}>
      {field.name}
      {field.required ? " *" : ""}
    </label>
  );

  if (field.enum && field.enum.length > 0) {
    return (
      <div className="field">
        {label}
        <select
          id={id}
          value={typeof value === "string" ? value : ""}
          required={field.required}
          onChange={(e) => onChange(field.name, e.target.value)}
        >
          <option value="">-- select --</option>
          {field.enum.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>
    );
  }

  if (field.type === "relation" && field.relationTo) {
    return (
      <div className="field">
        {label}
        {relationError ? <p className="error">{relationError}</p> : null}
        <select
          id={id}
          value={typeof value === "string" ? value : ""}
          required={field.required}
          onChange={(e) => onChange(field.name, e.target.value)}
        >
          <option value="">-- select {field.relationTo} --</option>
          {relationOptions.map((opt) => (
            <option key={opt.id} value={opt.id}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    );
  }

  if (field.type === "boolean") {
    return (
      <div className="field field-checkbox">
        <label htmlFor={id}>
          <input
            id={id}
            type="checkbox"
            checked={value === true}
            onChange={(e) => onChange(field.name, e.target.checked)}
          />
          {field.name}
        </label>
      </div>
    );
  }

  if (field.type === "json") {
    return (
      <div className="field">
        {label}
        <textarea
          id={id}
          rows={4}
          value={typeof value === "string" ? value : ""}
          required={field.required}
          onChange={(e) => onChange(field.name, e.target.value)}
        />
      </div>
    );
  }

  if (field.type === "number" || field.type === "money") {
    return (
      <div className="field">
        {label}
        <input
          id={id}
          type="number"
          step="any"
          value={value === undefined || value === "" ? "" : String(value)}
          required={field.required}
          onChange={(e) =>
            onChange(field.name, e.target.value === "" ? "" : Number(e.target.value))
          }
        />
      </div>
    );
  }

  return (
    <div className="field">
      {label}
      <input
        id={id}
        type="text"
        value={typeof value === "string" ? value : value === undefined ? "" : String(value)}
        required={field.required}
        onChange={(e) => onChange(field.name, e.target.value)}
      />
    </div>
  );
}
