import React from "react";

export default function FieldRenderer({ field, value, onChange, error }) {
  return (
    <div className="mb-4">
      <label className="block mb-1 font-medium">
        {field.label} {field.required && <span className="text-red-500">*</span>}
      </label>

      {field.type === "text" && (
        <input value={value || ""} placeholder={field.placeholder} onChange={(e)=>onChange(e.target.value)} className="input" />
      )}

      {field.type === "number" && (
        <input type="number" value={value || ""} placeholder={field.placeholder} onChange={(e)=>onChange(e.target.value)} className="input" />
      )}

      {field.type === "textarea" && (
        <textarea value={value || ""} placeholder={field.placeholder} onChange={(e)=>onChange(e.target.value)} className="input h-28" />
      )}

      {field.type === "select" && (
        <select value={value || ""} onChange={(e)=>onChange(e.target.value)} className="input">
          <option value="">-- select --</option>
          {(field.options || []).map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      )}

      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
}
