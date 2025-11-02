import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CloudArrowUpIcon, CalendarIcon, CurrencyRupeeIcon, TagIcon, DocumentTextIcon } from "@heroicons/react/24/outline";

export default function NewClaim({ addClaim }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    category: "",
    date: new Date().toISOString().split("T")[0],
    amount: "",
    notes: "",
    file: null,
  });
  const [drag, setDrag] = useState(false);

  const categories = ["Travel", "Conference", "Cell Phone", "Medical", "Books", "Software", "Equipment", "Other"];

  const submit = (e) => {
    e.preventDefault();
    if (!form.category || !form.amount) return alert("Category and Amount are required");
    addClaim({
      category: form.category,
      date: form.date,
      amount: Number(form.amount),
      notes: form.notes,
      fileName: form.file?.name || null,
    });
    navigate("/my-claims");
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Submit New Claim</h1>
      <p className="text-gray-600 mb-6">Provide claim details and upload your receipt.</p>

      <form onSubmit={submit} className="backdrop-blur-md bg-white/60 border border-white/30 shadow-xl rounded-2xl p-6 space-y-6">
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <TagIcon className="h-4 w-4" /> Category *
          </label>
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="">Select a category</option>
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <CalendarIcon className="h-4 w-4" /> Date *
            </label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <CurrencyRupeeIcon className="h-4 w-4" /> Amount (₹) *
            </label>
            <input
              type="number"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              placeholder="0.00"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <DocumentTextIcon className="h-4 w-4" /> Notes (optional)
          </label>
          <textarea
            rows={4}
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 resize-none"
            placeholder="Add any additional information about this expense..."
          />
        </div>

        <div
          className={`rounded-xl border-2 border-dashed p-8 text-center transition ${drag ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"}`}
          onDragOver={(e) => (e.preventDefault(), setDrag(true))}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDrag(false);
            if (e.dataTransfer.files?.[0]) setForm({ ...form, file: e.dataTransfer.files[0] });
          }}
        >
          <input id="file" type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={(e) => setForm({ ...form, file: e.target.files?.[0] })} />
          <label htmlFor="file" className="cursor-pointer block">
            <CloudArrowUpIcon className="h-12 w-12 mx-auto text-gray-400 mb-2" />
            {form.file ? (
              <>
                <p className="text-sm font-medium text-gray-900">{form.file.name}</p>
                <p className="text-xs text-gray-500">{(form.file.size / 1024).toFixed(1)} KB</p>
              </>
            ) : (
              <>
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG up to 10MB</p>
              </>
            )}
          </label>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={() => navigate("/dashboard")} className="flex-1 px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50">
            Cancel
          </button>
          <button type="submit" className="flex-1 px-6 py-3 rounded-xl text-white font-semibold bg-[#1A73E8] hover:bg-blue-700 shadow-lg hover:shadow-xl">
            Submit Claim
          </button>
        </div>
      </form>
    </div>
  );
}