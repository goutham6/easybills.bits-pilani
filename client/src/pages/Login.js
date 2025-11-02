import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "faculty",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Check URL for Google Login errors
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const err = params.get("error");

    if (err === "non-bits") {
      setError("Only official BITS Pilani email accounts are allowed.");
    } else if (err === "google-failed") {
      setError("Google login failed. Please try again.");
    }
  }, []);

  const validateBITSEmail = (email) => {
    const bitsEmailRegex =
      /@(pilani\.bits-pilani\.ac\.in|goa\.bits-pilani\.ac\.in|hyderabad\.bits-pilani\.ac\.in|dubai\.bits-pilani\.ac\.in|wilp\.bits-pilani\.ac\.in)$/;
    return bitsEmailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateBITSEmail(formData.email)) {
      setError("Only official BITS Pilani email accounts are allowed.");
      return;
    }

    setLoading(true);

    try {
      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
      const response = await fetch(
        process.env.NODE_ENV === "production"
          ? `https://easybills-bits-pilani.onrender.com${endpoint}`
          : `http://localhost:5000${endpoint}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(
            isLogin
              ? { email: formData.email, password: formData.password }
              : formData
          ),
        }
      );

      const data = await response.json();

      if (data.success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/dashboard");
      } else {
        if (data.message === "Invalid credentials") {
          setError("Incorrect email or password.");
        } else {
          setError(data.message || "Authentication failed.");
        }
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = () => {
    const url =
      process.env.NODE_ENV === "production"
        ? "https://easybills-bits-pilani.onrender.com/api/auth/google"
        : "http://localhost:5000/api/auth/google";

    window.location.href = url;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ UI Remains SAME Below This Line
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-700 to-indigo-800 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md mx-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-2xl mb-4">
            <span className="text-blue-900 font-bold text-2xl">BITS</span>
          </div>
          <h1 className="text-white text-4xl font-extrabold mb-2">EasyBills</h1>
          <p className="text-blue-200 text-sm font-medium">
            Faculty Reimbursement System
          </p>
          <p className="text-blue-300/80 text-xs mt-1">
            BITS Pilani - Work Integrated Learning Programmes
          </p>
        </div>

        {/* Card */}
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/20">
          <div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-xl">
            <button
              onClick={() => {
                setIsLogin(true);
                setError("");
              }}
              className={`flex-1 py-2.5 rounded-lg font-semibold transition-all ${
                isLogin
                  ? "bg-gradient-to-r from-blue-700 to-blue-600 text-white shadow-md"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => {
                setIsLogin(false);
                setError("");
              }}
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
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                className="w-full px-4 py-3 rounded-xl border border-gray-300"
                value={formData.name}
                onChange={handleChange}
                required
              />
            )}

            <input
              type="email"
              name="email"
              placeholder="BITS Email"
              className="w-full px-4 py-3 rounded-xl border border-gray-300"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              className="w-full px-4 py-3 rounded-xl border border-gray-300"
              value={formData.password}
              onChange={handleChange}
              required
            />

            {!isLogin && (
              <select
                name="role"
                className="w-full px-4 py-3 rounded-xl border-gray-300 border"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="faculty">Faculty</option>
                <option value="accounts">Accounts Team</option>
                <option value="admin">Admin</option>
              </select>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-blue-700 to-blue-600 text-white font-bold rounded-xl"
            >
              {loading ? "Processing..." : isLogin ? "Login" : "Register"}
            </button>

            {/* ✅ Google Button */}
            <button
              type="button"
              onClick={googleLogin}
              className="w-full flex items-center justify-center gap-3 py-3.5 bg-white border border-gray-300 text-gray-700 rounded-xl"
            >
              <img
                src="https://developers.google.com/identity/images/g-logo.png"
                className="w-5 h-5"
                alt="google"
              />
              Continue with Google
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
