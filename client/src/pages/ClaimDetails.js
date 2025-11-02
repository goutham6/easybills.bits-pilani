import React, { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeftIcon, CheckCircleIcon } from "@heroicons/react/24/outline";

const stages = ["Submitted", "Verified (Accounts Team)", "Approved (Dean)", "Paid (Finance)"];

export default function ClaimDetails({ claims }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const claim = useMemo(() => (claims || []).find((c) => c.id === id), [claims, id]);

  if (!claim) {
    return (
      <div className="p-8">
        <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-[#1A73E8] hover:underline">
          <ArrowLeftIcon className="h-4 w-4" /> Back
        </button>
        <p className="mt-4 text-gray-700">Claim not found.</p>
      </div>
    );
  }

  const currentStage = claim.stage || (claim.status === "Paid" ? 4 : claim.status === "Approved" ? 3 : claim.status === "Pending" ? 1 : 1);

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-[#1A73E8] hover:underline">
        <ArrowLeftIcon className="h-4 w-4" /> Back
      </button>

      {/* Info Card */}
      <div className="backdrop-blur-md bg-white/60 border border-white/30 shadow-xl rounded-2xl p-6">
        <h1 className="text-xl font-bold text-gray-900 mb-4">Claim {claim.id}</h1>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-gray-500">Category</p>
            <p className="text-gray-900 font-medium">{claim.category}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Date</p>
            <p className="text-gray-900 font-medium">{claim.date}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Amount</p>
            <p className="text-gray-900 font-semibold">₹{claim.amount.toLocaleString()}</p>
          </div>
        </div>

        {claim.fileName && (
          <div className="mt-4">
            <p className="text-xs text-gray-500">Attached File</p>
            <p className="text-gray-900">{claim.fileName}</p>
          </div>
        )}

        {claim.notes && (
          <div className="mt-4">
            <p className="text-xs text-gray-500">Notes</p>
            <p className="text-gray-900">{claim.notes}</p>
          </div>
        )}
      </div>

      {/* Workflow Tracking */}
      <div className="backdrop-blur-md bg-white/60 border border-white/30 shadow-xl rounded-2xl p-6">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">Workflow</h2>

        {/* Desktop: horizontal */}
        <div className="hidden md:block">
          <div className="relative">
            <div className="absolute top-3 left-0 right-0 h-1 bg-gray-200 rounded-full" />
            <div className="absolute top-3 left-0 h-1 bg-[#1A73E8] rounded-full" style={{ width: `${(currentStage - 1) * 33.33}%` }} />
            <div className="relative z-10 flex justify-between">
              {stages.map((label, i) => (
                <div key={label} className="flex flex-col items-center">
                  <div className={`h-7 w-7 rounded-full flex items-center justify-center ${i < currentStage ? "bg-[#1A73E8] text-white" : "bg-gray-200 text-gray-500"}`}>
                    {i + 1}
                  </div>
                  <span className="mt-2 text-xs text-gray-700 text-center w-28">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile: vertical */}
        <div className="md:hidden space-y-4">
          {stages.map((label, i) => (
            <div key={label} className="flex items-start gap-3">
              <div className={`h-6 w-6 rounded-full flex items-center justify-center mt-0.5 ${i < currentStage ? "bg-[#1A73E8] text-white" : "bg-gray-200 text-gray-500"}`}>
                <CheckCircleIcon className="h-4 w-4" />
              </div>
              <span className="text-sm text-gray-800">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}