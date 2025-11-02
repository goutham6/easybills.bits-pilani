import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "faculty"
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validateBITSEmail = (email) => {
    const bitsEmailRegex = /@(pilani\.bits-pilani\.ac\.in|goa\.bits-pilani\.ac\.in|hyderabad\.bits-pilani\.ac\.in|dubai\.bits-pilani\.ac\.in|wilp\.bits-pilani\.ac\.in)$/;
    return bitsEmailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate BITS email
    if (!validateBITSEmail(formData.email)) {
      setError("Please use a valid BITS Pilani email address");
      return;
    }

    setLoading(true);

    try {
      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(isLogin ? 
          { email: formData.email, password: formData.password } : 
          formData
        ),
      });

      const data = await response.json();

      if (data.success) {
        // Store token and user info
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/dashboard");
      } else {
        setError(data.message || "Authentication failed");
      }
    } catch (err) {
      setError("Network error. Please check if the server is running.");
      console.error("Auth error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-700 to-indigo-800 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md mx-4">
        {/* BITS Logo and Header */}
        <div className="text-center mb-8">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-2xl mb-4">
            <span className="text-blue-900 font-bold text-2xl">BITS</span>
          </div>
          <h1 className="text-white text-4xl font-extrabold mb-2">
            EasyBills
          </h1>
          <p className="text-blue-200 text-sm font-medium">
            Faculty Reimbursement System
          </p>
          <p className="text-blue-300/80 text-xs mt-1">
            BITS Pilani - Work Integrated Learning Programmes
          </p>
        </div>

        {/* Login/Register Card */}
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/20">
          {/* Toggle Tabs */}
          <div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-xl">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2.5 rounded-lg font-semibold transition-all ${
                isLogin
                  ? "bg-gradient-to-r from-blue-700 to-blue-600 text-white shadow-md"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2.5 rounded-lg font-semibold transition-all ${
                !isLogin
                  ? "bg-gradient-to-r from-blue-700 to-blue-600 text-white shadow-md"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Register
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-gray-700 font-medium text-sm mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition"
                  value={formData.name}
                  onChange={handleChange}
                  required={!isLogin}
                />
              </div>
            )}

            <div>
              <label className="block text-gray-700 font-medium text-sm mb-1.5">
                BITS Email ID
              </label>
              <input
                type="email"
                name="email"
                placeholder="yourname@pilani.bits-pilani.ac.in"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Use your official BITS Pilani email
              </p>
            </div>

            <div>
              <label className="block text-gray-700 font-medium text-sm mb-1.5">
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            {!isLogin && (
              <div>
                <label className="block text-gray-700 font-medium text-sm mb-1.5">
                  Role
                </label>
                <select
                  name="role"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition"
                  value={formData.role}
                  onChange={handleChange}
                >
                  <option value="faculty">Faculty</option>
                  <option value="accounts">Accounts Team</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-blue-700 to-blue-600 text-white font-bold rounded-xl hover:from-blue-800 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Processing..." : isLogin ? "Login" : "Register"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError("");
                }}
                className="ml-1 text-blue-700 font-semibold hover:text-blue-800"
              >
                {isLogin ? "Register" : "Login"}
              </button>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-blue-200 text-xs">
          <p>Track Every Rupee, Digitally and Transparently</p>
          <p className="mt-1 text-blue-300/60">© 2025 BITS Pilani. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}

export default Login;
