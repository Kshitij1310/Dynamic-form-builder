import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getForm, saveResponse, getResponses } from "../utils/storage";
import FieldRenderer from "../components/FieldRenderer";

export default function PreviewForm() {
  const { id } = useParams();
  const [schema, setSchema] = useState(null);
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [showData, setShowData] = useState(false);
  const [allResponses, setAllResponses] = useState([]);
  const [showAll, setShowAll] = useState(false);
  useEffect(() => {
    const s = getForm(id);
    setSchema(s);
    if (s) {
      const init = {};
      (s.fields || []).forEach((f) => {
        init[f.id] = f.defaultValue || "";
      });
      setValues(init);
    }
    setAllResponses(getResponses(id));
  }, [id]);

  if (!schema) return <div className="card">Form not found.</div>;
  function getReadableResponse(response) {
    const mapped = {};
    (schema.fields || []).forEach((field) => {
      mapped[field.label] = response[field.id];
    });
    return mapped;
  }
  function handleChange(fieldId, val) {
    setValues((prev) => ({ ...prev, [fieldId]: val }));
    setErrors((prev) => ({ ...prev, [fieldId]: "" }));
  }
  function validate() {
  const errs = {};
  (schema.fields || []).forEach((f) => {
    const v = (values[f.id] || "").toString().trim();
    if (f.required && !v) {
      errs[f.id] = `${f.label || "This field"} is required`;
      return;
    }
    if (f.type === "number" && v) {
      if (isNaN(Number(v))) {
        errs[f.id] = `${f.label || "Field"} must be a valid number`;
        return;
      }
    }
    if (
      (f.type === "text" || f.type === "email") &&
      f.label.toLowerCase().includes("email") &&
      v
    ) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(v)) {
        errs[f.id] = `${f.label || "Email"} is not a valid email`;
        return;
      }
    }
  });
  setErrors(errs);
  return Object.keys(errs).length === 0;
  }
  function submit() {
    if (!validate()) {
      setMessage("Please fix errors.");
      return;
    }
    saveResponse(id, values);
    const updated = getResponses(id);
    setAllResponses(updated);
    setMessage("Form submitted successfully! (saved)");
    setShowData(true);
  }
  function resetForm() {
    const init = {};
    (schema.fields || []).forEach((f) => {
      init[f.id] = "";
    });
    setValues(init);
    setErrors({});
    setMessage("");
    setShowData(false);
  }

  return (
    <div className="card">

      <h2 className="text-xl font-semibold mb-2">{schema.title}</h2>

      <div className="mt-4">
        {(schema.fields || []).map((f) => (
          <FieldRenderer
            key={f.id}
            field={f}
            value={values[f.id]}
            onChange={(v) => handleChange(f.id, v)}
            error={errors[f.id]}
          />
        ))}
      </div>

      <div className="flex gap-3 mt-4">
        <button onClick={submit} className="px-4 py-2 bg-sky-600 text-white rounded">
          Submit
        </button>
        <button onClick={resetForm} className="px-4 py-2 border rounded">
          Reset
        </button>
        <button
          onClick={() => setShowAll(!showAll)}
          className="px-4 py-2 border rounded"
        >
          {showAll ? "Hide All Submissions" : "Show All Submissions"}
        </button>
      </div>

      {message && <p className="mt-3 text-green-600">{message}</p>}
      {showData && (
        <div className="mt-6 p-4 border rounded bg-slate-50">
          <h3 className="font-semibold mb-2">Last Submitted Data</h3>

          <pre className="text-sm bg-white p-3 rounded border">
{JSON.stringify(getReadableResponse(values), null, 2)}
          </pre>
        </div>
      )}
      {showAll && (
        <div className="mt-6 p-4 border rounded bg-white">
          <h3 className="font-semibold mb-3">All Submissions</h3>

          {allResponses.length === 0 ? (
            <p className="text-slate-500 text-sm">No submissions yet.</p>
          ) : (
            <div className="space-y-3">
              {allResponses.map((resp, idx) => (
                <div key={idx} className="p-3 border rounded bg-slate-50 shadow-sm">
                  <div className="text-sm text-slate-500 mb-1">
                    Submitted at: {resp.submittedAt}
                  </div>

                  <pre className="text-sm bg-white p-3 rounded border">
{JSON.stringify(getReadableResponse(resp), null, 2)}
                  </pre>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
}
