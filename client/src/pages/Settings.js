import React, { useState } from "react";

export default function Settings() {
  const [name, setName] = useState(JSON.parse(localStorage.getItem("user") || '{"name":"Dr. John Doe"}').name);

  const save = () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    localStorage.setItem("user", JSON.stringify({ ...user, name }));
    alert("Saved!");
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="backdrop-blur-md bg-white/60 border border-white/30 shadow-xl rounded-2xl p-6 space-y-4">
        <h1 className="text-xl font-bold text-gray-900">Profile Settings</h1>
        <label className="text-sm text-gray-700">Display Name</label>
        <input className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" value={name} onChange={(e) => setName(e.target.value)} />
        <button onClick={save} className="px-5 py-2 rounded-xl bg-[#1A73E8] text-white hover:bg-blue-700">Save</button>
      </div>
    </div>
  );
}