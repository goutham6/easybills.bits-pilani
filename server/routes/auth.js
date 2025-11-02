const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const axios = require("axios");

const JWT_SECRET = process.env.JWT_SECRET || "easybills_secret_key_2025";
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";

// ✅ Validate BITS Email
const isValidBITSEmail = (email) => {
  const bitsEmailRegex = /@(pilani\.bits-pilani\.ac\.in|goa\.bits-pilani\.ac\.in|hyderabad\.bits-pilani\.ac\.in|dubai\.bits-pilani\.ac\.in|wilp\.bits-pilani\.ac\.in)$/;
  return bitsEmailRegex.test(email);
};

// ✅ REGISTER
router.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    if (!isValidBITSEmail(email)) {
      return res.status(400).json({ success: false, message: "Only BITS Pilani official emails are allowed." });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ success: false, message: "User already exists" });

    const hashedPass = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPass,
      role: role || "faculty"
    });

    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: "7d" });

    res.status(201).json({ success: true, token, user });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
});

// ✅ LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ success: false, message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ success: false, message: "Invalid credentials" });

    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: "7d" });

    res.json({ success: true, token, user });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
});


// Google OAuth is handled by Passport in server.js. Manual route removed to avoid conflicts.

// Google OAuth callback is handled by Passport in server.js. Manual route removed to avoid conflicts.

module.exports = router;
