const PREFIX = "form-builder-";
export const saveForm = (id, schema) => {
  localStorage.setItem(PREFIX + id, JSON.stringify(schema));
};
export const getForm = (id) => {
  const raw = localStorage.getItem(PREFIX + id);
  return raw ? JSON.parse(raw) : null;
};
export const getAllForms = () => {
  const res = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(PREFIX)) {
      const id = key.slice(PREFIX.length);
      try {
        const data = JSON.parse(localStorage.getItem(key));
        res.push({ id, ...data });
      } catch {
      }
    }
  }
  return res.sort((a, b) => (a._savedAt < b._savedAt ? 1 : -1));
};
export const deleteForm = (id) => {
  localStorage.removeItem(PREFIX + id);
};
export const saveResponse = (formId, values) => {
  const all = JSON.parse(localStorage.getItem("form-responses") || "{}");

  if (!all[formId]) all[formId] = [];

  all[formId].push({
    ...values,
    submittedAt: new Date().toLocaleString()
  });

  localStorage.setItem("form-responses", JSON.stringify(all));
};
export const getResponses = (formId) => {
  const all = JSON.parse(localStorage.getItem("form-responses") || "{}");
  return all[formId] || [];
};
