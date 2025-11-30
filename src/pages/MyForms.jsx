import React, { useEffect, useState } from "react";
import { getAllForms, deleteForm } from "../utils/storage";
import { Link } from "react-router-dom";

export default function MyForms() {
  const [list, setList] = useState([]);
  useEffect(() => {
    setList(getAllForms());
  }, []);

  function remove(id) {
    if (!confirm("Delete this form?")) return;
    deleteForm(id);
    setList(getAllForms());
  }
  if (!list.length) {
    return (
      <div className="card">
        <h2 className="text-xl font-semibold">My Forms</h2>
        <p className="text-slate-500 mt-2">No saved forms yet. Create one first.</p>
      </div>
    );
  }
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">My Forms</h2>
      <div className="space-y-4">
        {list.map(f => (
          <div key={f.id} className="card flex items-center justify-between">
            <div>
              <div className="font-semibold">{f.title || "Untitled"}</div>
              <div className="text-sm text-slate-500">{(f.fields || []).length} fields • saved {new Date(f._savedAt).toLocaleString()}</div>
            </div>
            <div className="flex gap-2">
              <Link to={`/preview/${f.id}`} className="px-3 py-1 border rounded">Preview</Link>
              <button onClick={()=>remove(f.id)} className="px-3 py-1 bg-red-50 text-red-600 border rounded">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
