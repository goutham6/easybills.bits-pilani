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

  // ✅ Unified API Base URL
  const API_BASE_URL =
    process.env.NODE_ENV === "production"
      ? process.env.REACT_APP_API_URL
      : "http://localhost:5000";

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const err = params.get("error");
    if (err === "non-bits") setError("Only official BITS Pilani email accounts are allowed.");
    if (err === "google-failed") setError("Google login failed. Please try again.");
  }, []);

  const validateBITSEmail = (email) => {
    return /@(pilani\.bits-pilani\.ac\.in|goa\.bits-pilani\.ac\.in|hyderabad\.bits-pilani\.ac\.in|dubai\.bits-pilani\.ac\.in|wilp\.bits-pilani\.ac\.in)$/.test(
      email
    );
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

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          isLogin
            ? { email: formData.email, password: formData.password }
            : formData
        ),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/dashboard");
      } else {
        setError(data.message || "Authentication failed.");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = () => {
    window.location.href = `${API_BASE_URL}/api/auth/google`;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div>Your same UI code continues exactly here...</div>
  );
}

export default Login;
