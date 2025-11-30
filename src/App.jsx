import React from "react";
import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import CreateForm from "./pages/CreateForm";
import PreviewForm from "./pages/PreviewForm";
import MyForms from "./pages/MyForms";
function Nav() {
  return (
    <nav className="backdrop-blur-md bg-white/70 border-b shadow-sm sticky top-0 z-50">
      <div className="max-w-5xl mx-auto flex items-center justify-between p-4">
       <Link to="/create" className="text-2xl font-bold text-indigo-700">
          Form Builder
       </Link>
        <div className="flex items-center gap-4">
          <Link to="/create" className="hover:text-sky-600 transition">Create</Link>
          <Link to="/myforms" className="hover:text-sky-600 transition">My Forms</Link>
        </div>
      </div>
    </nav>
  );
}
export default function App() {
  return (
    <BrowserRouter>
      <Nav />
      <div className="max-w-5xl mx-auto p-6">
        <Routes>
          <Route path="/" element={<Navigate to="/create" replace />} />
          <Route path="/create" element={<CreateForm />} />
          <Route path="/preview/:id" element={<PreviewForm />} />
          <Route path="/myforms" element={<MyForms />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
