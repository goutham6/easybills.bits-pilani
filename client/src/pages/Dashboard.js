import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bars3Icon,
  BellIcon,
  HomeIcon,
  DocumentPlusIcon,
  DocumentTextIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  QuestionMarkCircleIcon,
  UserCircleIcon,
  ClockIcon,
  CheckCircleIcon,
  CurrencyRupeeIcon,
  ExclamationCircleIcon,
  EyeIcon,
  PlusIcon,
  XMarkIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";

// Status pill styles
const STATUS_STYLES = {
  Pending: "bg-amber-100 text-amber-800",
  Approved: "bg-green-100 text-green-800",
  Paid: "bg-blue-100 text-blue-800",
  Rejected: "bg-red-100 text-red-800",
  Draft: "bg-gray-100 text-gray-800",
  Submitted: "bg-indigo-100 text-indigo-800",
  "Referred Back": "bg-orange-100 text-orange-800",
  Verified: "bg-emerald-100 text-emerald-800",
};

// Summary Card Component with Glassmorphism
const SummaryCard = ({ icon: Icon, title, value, bgGradient }) => (
  <div className="relative backdrop-blur-md bg-white/40 border border-white/30 shadow-xl rounded-2xl p-6 hover:shadow-2xl transition-all duration-300 hover:scale-105">
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-xl ${bgGradient} shadow-lg`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
      </div>
    </div>
  </div>
);

export default function Dashboard() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Mock data for demonstration
  const [claims] = useState([
    { id: "CLM-2024-001", category: "Travel", date: "2024-11-28", amount: 15000, status: "Approved" },
    { id: "CLM-2024-002", category: "Cell Phone", date: "2024-11-25", amount: 2500, status: "Pending" },
    { id: "CLM-2024-003", category: "Conference", date: "2024-11-20", amount: 45000, status: "Paid" },
    { id: "CLM-2024-004", category: "Medical", date: "2024-11-18", amount: 8000, status: "Rejected" },
    { id: "CLM-2024-005", category: "Books", date: "2024-11-15", amount: 3500, status: "Pending" },
    { id: "CLM-2024-006", category: "Travel", date: "2024-11-12", amount: 22000, status: "Approved" },
    { id: "CLM-2024-007", category: "Software", date: "2024-11-10", amount: 12000, status: "Paid" },
  ]);

  // Get user info
  const user = JSON.parse(localStorage.getItem("user") || '{ "name": "Dr. John Doe", "role": "Faculty" }');

  // Calculate summary statistics
  const totalClaims = claims.length;
  const pendingClaims = claims.filter(c => c.status === "Pending").length;
  const approvedClaims = claims.filter(c => c.status === "Approved").length;
  const paidClaims = claims.filter(c => c.status === "Paid").length;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  // Updated navigation items as per requirements
  const navItems = [
    { name: "Dashboard", icon: HomeIcon, href: "#", current: currentPage === "dashboard" },
    { name: "New Claim", icon: DocumentPlusIcon, href: "#", current: currentPage === "new-claim" },
    { name: "My Claims", icon: DocumentTextIcon, href: "#", current: currentPage === "my-claims" },
    { name: "Reports", icon: ChartBarIcon, href: "#", current: currentPage === "reports" },
    { name: "Notifications", icon: BellIcon, href: "#", current: currentPage === "notifications" },
    { name: "Settings", icon: Cog6ToothIcon, href: "#", current: currentPage === "settings" },
    { name: "Support", icon: QuestionMarkCircleIcon, href: "#", current: currentPage === "support" },
  ];

  return (
    <div className="min-h-screen bg-[#F7F9FC]">
      {/* Top Navigation Bar - Height 70px */}
      <header className="fixed top-0 left-0 right-0 z-50 h-[70px] bg-white shadow-sm border-b border-gray-200">
        <div className="h-full max-w-[1366px] mx-auto px-6 flex items-center justify-between">
          {/* Left: Logo */}
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-[#1A73E8]">EasyBills</h1>
          </div>

          {/* Right: Notifications and Profile */}
          <div className="flex items-center gap-4">
            <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <BellIcon className="h-6 w-6 text-gray-600" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
            </button>

            <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors">
              <div className="h-10 w-10 bg-[#1A73E8] rounded-full flex items-center justify-center text-white font-semibold">
                {user.name?.charAt(0) || "U"}
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-gray-900">{user.name || "User"}</p>
                <p className="text-xs text-gray-500">{user.role || "Faculty"}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Left Sidebar - Width 240px */}
        <aside className="fixed left-0 top-[70px] h-[calc(100vh-70px)] w-[240px] bg-white border-r border-gray-200">
          <nav className="p-4 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => {
                  setCurrentPage(item.name.toLowerCase().replace(" ", "-"));
                  navigate(`/${item.name.toLowerCase().replace(" ", "-")}`);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all relative ${
                  item.current
                    ? "bg-blue-50 text-[#1A73E8] font-semibold before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-[#1A73E8] before:rounded-r"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span className="text-sm">{item.name}</span>
              </button>
            ))}

            <div className="pt-4 mt-4 border-t border-gray-200">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5" />
                <span className="text-sm">Logout</span>
              </button>
            </div>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="ml-[240px] mt-[70px] flex-1 p-8">
          {/* Page Title */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
            <p className="text-sm text-gray-500 mt-1">Welcome back, {user.name || "User"}</p>
          </div>

          {/* Summary Cards - 4 in a row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <SummaryCard
              icon={DocumentTextIcon}
              title="Total Claims"
              value={totalClaims}
              bgGradient="bg-gradient-to-br from-[#1A73E8] to-blue-600"
            />
            <SummaryCard
              icon={ClockIcon}
              title="Pending Verification"
              value={pendingClaims}
              bgGradient="bg-gradient-to-br from-amber-500 to-amber-600"
            />
            <SummaryCard
              icon={CheckCircleIcon}
              title="Approved Claims"
              value={approvedClaims}
              bgGradient="bg-gradient-to-br from-green-500 to-green-600"
            />
            <SummaryCard
              icon={CurrencyRupeeIcon}
              title="Reimbursed / Paid"
              value={paidClaims}
              bgGradient="bg-gradient-to-br from-purple-500 to-purple-600"
            />
          </div>

          {/* Recent Claims Section */}
          <div className="backdrop-blur-md bg-white/60 border border-white/30 shadow-xl rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Recent Claims</h3>
   <button
  onClick={() => navigate("/new-claim")}
  className="flex items-center gap-2 px-4 py-2 bg-[#1A73E8] text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
>
  <PlusIcon className="h-5 w-5" />
  Submit New Claim
</button>
            </div>

            {/* Claims Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Claim ID</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Category</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Date</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Amount</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-700">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {claims.map((claim) => (
                    <tr key={claim.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 px-4 text-sm font-medium text-gray-900">{claim.id}</td>
                      <td className="py-4 px-4 text-sm text-gray-600">{claim.category}</td>
                      <td className="py-4 px-4 text-sm text-gray-600">{claim.date}</td>
                      <td className="py-4 px-4 text-sm font-medium text-gray-900">₹{claim.amount.toLocaleString()}</td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${STATUS_STYLES[claim.status]}`}>
                          {claim.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <button className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-[#1A73E8] hover:bg-blue-50 rounded-lg transition-colors">
                          View
                          <EyeIcon className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-medium text-gray-600">Total Claimed Amount</h4>
                <CurrencyRupeeIcon className="h-5 w-5 text-gray-400" />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                ₹{claims.reduce((sum, claim) => sum + claim.amount, 0).toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 mt-2">Across all claims</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-medium text-gray-600">Approval Rate</h4>
                <CheckCircleIcon className="h-5 w-5 text-gray-400" />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {Math.round((approvedClaims / totalClaims) * 100)}%
              </p>
              <p className="text-xs text-gray-500 mt-2">Claims approved</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-medium text-gray-600">Processing Time</h4>
                <ClockIcon className="h-5 w-5 text-gray-400" />
              </div>
              <p className="text-2xl font-bold text-gray-900">3.5 days</p>
              <p className="text-xs text-gray-500 mt-2">Average processing time</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}