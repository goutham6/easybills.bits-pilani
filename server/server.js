// server/server.js
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const jwt = require("jsonwebtoken");
const passport = require("./config/googleAuth"); // Google Auth (Passport)

const app = express();

// Basic config
app.use(express.json());

// CORS (tighten for production)
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";
const allowedOrigins = [
  "http://localhost:3000",
  CLIENT_URL, // production client URL
];
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// Initialize passport
app.use(passport.initialize());

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// MongoDB connection
const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://easybills:Tbagwell123@easybills.gd64hi3.mongodb.net/easybills";

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ MongoDB Error:", err));

// API routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/claims", require("./routes/claims"));

// Google OAuth (Passport) — keep only these, do not duplicate in routes/auth.js
app.get(
  "/api/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/api/auth/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${CLIENT_URL}/login?error=google-failed`,
  }),
  (req, res) => {
    const token = jwt.sign(
      { id: req.user._id, role: req.user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const redirectURL =
      process.env.NODE_ENV === "production"
        ? `${CLIENT_URL}/dashboard?token=${token}`
        : `http://localhost:3000/dashboard?token=${token}`;

    return res.redirect(redirectURL);
  }
);

// Serve Frontend (React build)
const buildPath = path.join(__dirname, "..", "client", "build");
app.use(express.static(buildPath));

// React Router fallback
app.use((req, res, next) => {
  if (req.method === "GET" && !req.path.startsWith("/api")) {
    return res.sendFile(path.join(buildPath, "index.html"));
  }
  next();
});


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));