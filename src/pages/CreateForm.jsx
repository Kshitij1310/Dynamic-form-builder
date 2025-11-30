import React, { useState } from "react";
import { uuid } from "../utils/uuid";
import FieldEditor from "../components/FieldEditor";
import { saveForm } from "../utils/storage";

function emptyField(type = "text") {
  return {
    id: uuid(),
    type,
    label: "New Field",
    placeholder: "",
    required: false,
    options: type === "select" ? ["Option 1", "Option 2"] : [],
    defaultValue: ""
  };
}
export default function CreateForm() {
  const [title, setTitle] = useState("Untitled Form");
  const [fields, setFields] = useState([]);
  const [selected, setSelected] = useState(null);
  const [message, setMessage] = useState("");

  function addField(type) {
    const f = emptyField(type);
    setFields(prev => [...prev, f]);
    setSelected(f.id);
  }
  function updateField(updated) {
    setFields(prev => prev.map(f => (f.id === updated.id ? updated : f)));
  }
  function removeField(id) {
    setFields(prev => prev.filter(f => f.id !== id));
    if (selected === id) setSelected(null);
  }
  function save() {
    if (!title.trim()) {
      setMessage("Please provide a form name.");
      return;
    }
    const id = uuid();
    const schema = { title: title.trim(), fields, _savedAt: Date.now() };
    saveForm(id, schema);
    setMessage("Form saved! Go to My Forms to preview.");
  }
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <div className="bg-white shadow-md rounded-xl p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <input
              className="text-3xl font-bold text-slate-800 w-full bg-white border-b border-slate-300 focus:border-sky-500 outline-none pb-1 transition"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <button
              onClick={save}
              className="ml-4 bg-sky-500 text-white px-5 py-2 rounded-lg shadow hover:bg-sky-600 transition"
            >
              Save
            </button>
          </div>
          <p className="text-sm text-slate-500 mb-4">
            Add fields from the right and configure them.
          </p>
          <div className="space-y-3">
            {fields.length === 0 && (
              <div className="p-6 border rounded-xl bg-slate-50 text-slate-500 text-center">
                No fields added yet. Use options on the right.
              </div>
            )}
            {fields.map(f => (
              <div
                key={f.id}
                onClick={() => setSelected(f.id)}
                className={`p-4 rounded-xl border cursor-pointer transition 
                  ${
                    selected === f.id
                      ? "border-sky-500 bg-sky-50"
                      : "hover:bg-slate-50 border-slate-200"
                  }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-semibold text-slate-800">{f.label}</div>
                    <div className="text-xs text-slate-500 capitalize">{f.type}</div>
                  </div>
                  <div className="text-xs text-slate-500">
                    {f.required ? "Required" : "Optional"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <aside>
        <div className="bg-white shadow-md rounded-xl p-6 border border-slate-200">
          <div className="mb-4 grid grid-cols-2 gap-3">
            {["text", "number", "textarea", "select"].map((type) => (
              <button
                key={type}
                onClick={() => addField(type)}
                className="px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg shadow-sm hover:bg-sky-50 hover:border-sky-400 transition text-sm"
              >
                + {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
          <hr className="my-4" />
          <h4 className="font-semibold mb-2 text-slate-700">Field Settings</h4>
          {selected ? (
            <FieldEditor
              field={fields.find((f) => f.id === selected)}
              onChange={f => updateField(f)}
              onRemove={id => removeField(id)}
            />
          ) : (
            <p className="text-sm text-slate-500">Select a field to edit.</p>
          )}
          <div className="mt-6">
            <h4 className="font-semibold mb-2 text-slate-700">Quick Preview</h4>
            <div className="bg-slate-50 p-3 rounded-xl border">
              {fields.slice(0, 3).map(f => (
                <div
                  key={f.id}
                  className="border border-slate-200 bg-white p-3 rounded-lg shadow-sm mb-2">
                  <div className="font-medium">{f.label}</div>
                  <div className="text-xs text-slate-500">{f.type}</div>
                </div>
              ))}
            </div>
          </div>
          {message && (
            <p className="mt-4 text-green-600 text-sm font-medium">{message}</p>
          )}
        </div>
      </aside>
    </div>
  );
}
