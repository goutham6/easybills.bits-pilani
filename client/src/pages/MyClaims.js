import React, { useMemo, useState } from "react";
import { EyeIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

const badge = {
  Pending: "bg-amber-100 text-amber-800",
  Approved: "bg-green-100 text-green-800",
  Paid: "bg-blue-100 text-blue-800",
  Rejected: "bg-red-100 text-red-800",
};

export default function MyClaims({ claims }) {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("All");

  const data = useMemo(() => {
    let rows = claims || [];
    if (status !== "All") rows = rows.filter((c) => c.status === status);
    if (q) rows = rows.filter((c) => c.id.toLowerCase().includes(q.toLowerCase()) || c.category.toLowerCase().includes(q.toLowerCase()));
    return rows;
  }, [claims, q, status]);

  return (
    <div className="p-8 max-w-[1366px] mx-auto">
      <div className="mb-6 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">My Claims</h1>
        <div className="flex gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-72">
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input className="w-full rounded-xl border border-gray-300 pl-10 pr-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" placeholder="Search claims..." value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <select className="rounded-xl border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" value={status} onChange={(e) => setStatus(e.target.value)}>
            {["All", "Pending", "Approved", "Paid", "Rejected"].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="backdrop-blur-md bg-white/60 border border-white/30 shadow-xl rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-gray-700">
                <th className="text-left py-3 px-4">Claim ID</th>
                <th className="text-left py-3 px-4">Category</th>
                <th className="text-left py-3 px-4">Date</th>
                <th className="text-left py-3 px-4">Amount</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-right py-3 px-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {data.map((c) => (
                <tr key={c.id} className="border-b border-gray-100 hover:bg-gray-50/60">
                  <td className="py-3 px-4 font-medium text-gray-900">{c.id}</td>
                  <td className="py-3 px-4 text-gray-700">{c.category}</td>
                  <td className="py-3 px-4 text-gray-700">{c.date}</td>
                  <td className="py-3 px-4 font-semibold text-gray-900">₹{c.amount.toLocaleString()}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${badge[c.status]}`}>{c.status}</span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-[#1A73E8] hover:bg-blue-50" onClick={() => navigate(`/claim/${c.id}`)}>
                      View
                      <EyeIcon className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {data.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-gray-500">
                    No claims found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}