import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import NewClaim from "./pages/NewClaim";
import MyClaims from "./pages/MyClaims";
import ClaimDetails from "./pages/ClaimDetails";
import Settings from "./pages/Settings";
import Support from "./pages/Support";
import Login from "./pages/Login";

export default function App() {
  const [claims, setClaims] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem("claims");
    if (stored) {
      setClaims(JSON.parse(stored));
    } else {
      const mock = [
        { id: "CLM-2024-001", category: "Travel", date: "2024-11-28", amount: 15000, status: "Approved", notes: "Conference travel", stage: 3 },
        { id: "CLM-2024-002", category: "Cell Phone", date: "2024-11-25", amount: 2500, status: "Pending", notes: "Mobile bill", stage: 1 },
        { id: "CLM-2024-003", category: "Conference", date: "2024-11-20", amount: 45000, status: "Paid", notes: "IEEE registration", stage: 4 },
      ];
      setClaims(mock);
      localStorage.setItem("claims", JSON.stringify(mock));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("claims", JSON.stringify(claims));
  }, [claims]);

  const addClaim = (newClaim) => {
    const claim = {
      ...newClaim,
      id: `CLM-2024-${String((claims?.length || 0) + 1).padStart(3, "0")}`,
      status: "Pending",
      stage: 1,
    };
    setClaims([claim, ...(claims || [])]);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Layout>
                <Routes>
                  <Route path="/dashboard" element={<Dashboard claims={claims} />} />
                  <Route path="/new-claim" element={<NewClaim addClaim={addClaim} />} />
                  <Route path="/my-claims" element={<MyClaims claims={claims} />} />
                  <Route path="/claim/:id" element={<ClaimDetails claims={claims} />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/support" element={<Support />} />
                  <Route path="/reports" element={<div className="p-8">Reports - Coming soon</div>} />
                  <Route path="/notifications" element={<div className="p-8">Notifications - Coming soon</div>} />
                  <Route path="*" element={<Navigate to="/dashboard" />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}