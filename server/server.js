// server.js
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(express.json());
app.use(cors());

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://easybills:Tbagwell123@easybills.gd64hi3.mongodb.net/easybills";
mongoose.connect(MONGODB_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log("❌ MongoDB Error:", err));

// ✅ API Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/claims", require("./routes/claims"));

// ✅ Serve Frontend (React build)
const buildPath = path.join(__dirname, "..", "client", "build");
app.use(express.static(buildPath));

// When no API routes match → send React index.html (Fixes React Router 404)
app.get("*", (req, res) => {
  res.sendFile(path.join(buildPath, "index.html"));
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
