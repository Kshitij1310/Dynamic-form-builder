import React from "react";
const FIELD_TYPES = ["text", "number", "textarea", "select"];

export default function FieldEditor({ field, onChange, onRemove }) {
  if (!field) return null;
  return (
    <div className="card mb-3">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold">{field.label || "Untitled Field"}</h3>
          <p className="text-sm text-slate-500">Type: {field.type}</p>
        </div>
        <button onClick={() => onRemove(field.id)} className="text-red-500 text-sm">Remove</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
        <div>
          <label className="block text-sm">Label</label>
          <input value={field.label} onChange={(e)=>onChange({...field,label:e.target.value})} className="input" />
        </div>
        
        <div>
          <label className="block text-sm">Placeholder</label>
          <input value={field.placeholder} onChange={(e)=>onChange({...field,placeholder:e.target.value})} className="input" />
        </div>

        <div>
          <label className="block text-sm">Default Value</label>
          <input value={field.defaultValue || ""} onChange={(e)=>onChange({...field,defaultValue:e.target.value})} className="input" />
        </div>

        <div>
          <label className="block text-sm">Required</label>
          <select value={field.required ? "yes":"no"} onChange={(e)=>onChange({...field,required: e.target.value === "yes"})} className="input">
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </select>
        </div>

        <div>
          <label className="block text-sm">Type</label>
          <select value={field.type} onChange={(e)=>onChange({...field,type:e.target.value, options: e.target.value === "select" ? (field.options || ["Option 1"]) : []})} className="input">
            {FIELD_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        {field.type === "select" && (
          <div>
            <label className="block text-sm">Options (one per line)</label>
            <textarea value={(field.options || []).join("\n")} onChange={(e)=>onChange({...field,options: e.target.value.split("\n").map(s=>s.trim()).filter(Boolean)})} className="input h-24" />
          </div>
        )}
      </div>
    </div>
  );
}
