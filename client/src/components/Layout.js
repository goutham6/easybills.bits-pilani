import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Bars3Icon,
  BellIcon,
  HomeIcon,
  DocumentPlusIcon,
  DocumentTextIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  QuestionMarkCircleIcon,
  ArrowRightOnRectangleIcon,
  ChevronDownIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";

export default function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem("user") || '{ "name":"Dr. John Doe","role":"Faculty" }');

  const nav = [
    { name: "Dashboard", icon: HomeIcon, path: "/dashboard" },
    { name: "New Claim", icon: DocumentPlusIcon, path: "/new-claim" },
    { name: "My Claims", icon: DocumentTextIcon, path: "/my-claims" },
    { name: "Reports", icon: ChartBarIcon, path: "/reports" },
    { name: "Notifications", icon: BellIcon, path: "/notifications" },
    { name: "Settings", icon: Cog6ToothIcon, path: "/settings" },
    { name: "Support", icon: QuestionMarkCircleIcon, path: "/support" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#F7F9FC]">
      {/* Top navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-white/80 backdrop-blur-lg border-b border-gray-200">
        <div className="h-full max-w-[1366px] mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button className="lg:hidden p-2 rounded-lg hover:bg-gray-100" onClick={() => setSidebarOpen((v) => !v)}>
              <Bars3Icon className="h-6 w-6 text-gray-700" />
            </button>
            <Link to="/dashboard" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#1A73E8] to-blue-600 text-white font-bold flex items-center justify-center">EB</div>
              <span className="text-xl font-bold text-[#1A73E8]">EasyBills</span>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-lg hover:bg-gray-100 transition">
              <BellIcon className="h-6 w-6 text-gray-600" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
            </button>

            <div className="relative">
              <button className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100" onClick={() => setProfileOpen((v) => !v)}>
                <div className="h-8 w-8 rounded-full bg-[#1A73E8] text-white font-semibold flex items-center justify-center">
                  {user.name?.charAt(0) || "U"}
                </div>
                <ChevronDownIcon className="h-4 w-4 text-gray-600" />
              </button>
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl border border-gray-200 shadow-xl p-1">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-semibold">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.role}</p>
                  </div>
                  <Link to="/settings" onClick={() => setProfileOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg hover:bg-gray-50">
                    <UserCircleIcon className="h-4 w-4" />
                    Profile Settings
                  </Link>
                  <button onClick={handleLogout} className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm rounded-lg hover:bg-gray-50">
                    <ArrowRightOnRectangleIcon className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside className={`fixed top-16 left-0 z-40 h-[calc(100vh-64px)] w-60 bg-white border-r border-gray-200 transform transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <nav className="p-4 space-y-1">
          {nav.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition relative ${
                  active
                    ? "bg-blue-50 text-[#1A73E8] font-medium before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-[#1A73E8] before:rounded-r"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span className="text-sm">{item.name}</span>
              </Link>
            );
          })}
          <div className="pt-4 mt-4 border-t border-gray-200" />
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600">
            <ArrowRightOnRectangleIcon className="h-5 w-5" />
            <span className="text-sm">Logout</span>
          </button>
        </nav>
      </aside>

      {/* Main content */}
      <main className="lg:ml-60 mt-16 min-h-[calc(100vh-64px)]">{children}</main>
    </div>
  );
}