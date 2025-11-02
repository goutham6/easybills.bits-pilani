import React, { useState } from "react";

export default function Support() {
  const [form, setForm] = useState({ email: "", message: "" });

  const submit = (e) => {
    e.preventDefault();
    alert("Thanks! We'll get back to you soon.");
    setForm({ email: "", message: "" });
  };

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-6">
      <div className="backdrop-blur-md bg-white/60 border border-white/30 shadow-xl rounded-2xl p-6">
        <h1 className="text-xl font-bold text-gray-900 mb-2">Support</h1>
        <p className="text-gray-600">Find answers to common questions or contact us.</p>
      </div>

      <div className="backdrop-blur-md bg-white/60 border border-white/30 shadow-xl rounded-2xl p-6 space-y-3">
        <h2 className="text-sm font-semibold text-gray-900">FAQs</h2>
        <div>
          <p className="font-medium text-gray-900">How do I submit a new claim?</p>
          <p className="text-sm text-gray-600">Use the New Claim page and fill the form with the required information.</p>
        </div>
        <div>
          <p className="font-medium text-gray-900">How can I track approval?</p>
          <p className="text-sm text-gray-600">Open a claim to view its workflow and status.</p>
        </div>
      </div>

      <form onSubmit={submit} className="backdrop-blur-md bg-white/60 border border-white/30 shadow-xl rounded-2xl p-6 space-y-4">
        <h2 className="text-sm font-semibold text-gray-900">Contact us</h2>
        <input className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" placeholder="Your email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <textarea className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" rows={4} placeholder="Your message" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
        <button className="px-5 py-2 rounded-xl bg-[#1A73E8] text-white hover:bg-blue-700">Send</button>
      </form>
    </div>
  );
}