// server.js
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const passport = require("./config/googleAuth"); // ✅ Google Auth Config
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());
app.use(cors());
app.use(passport.initialize()); // ✅ initialize passport

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ MongoDB Connection
const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://easybills:Tbagwell123@easybills.gd64hi3.mongodb.net/easybills";

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ MongoDB Error:", err));

// ✅ API Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/claims", require("./routes/claims"));

// ✅ GOOGLE LOGIN ROUTES
app.get(
  "/api/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/api/auth/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    // Create Token
    const token = jwt.sign(
      { id: req.user._id, role: req.user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Redirect to frontend with token
    const redirectURL =
      process.env.NODE_ENV === "production"
        ? `https://easybills-bits-pilani.onrender.com/dashboard?token=${token}`
        : `http://localhost:3000/dashboard?token=${token}`;

    return res.redirect(redirectURL);
  }
);

// ✅ Serve Frontend (React build)
const buildPath = path.join(__dirname, "..", "client", "build");
app.use(express.static(buildPath));

// Fix React Router (so refresh doesn't break)
app.get("*", (req, res) => {
  res.sendFile(path.join(buildPath, "index.html"));
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
