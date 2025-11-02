const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "easybills_secret_key_2025";

// Verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ success: false, message: "Access token required" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, message: "Invalid or expired token" });
    }
    req.user = user; // Add user info to request
    next();
  });
};

// Check if user is faculty
const isFaculty = (req, res, next) => {
  if (req.user.role !== "faculty") {
    return res.status(403).json({ success: false, message: "Faculty access only" });
  }
  next();
};

// Check if user is accounts team
const isAccounts = (req, res, next) => {
  if (req.user.role !== "accounts") {
    return res.status(403).json({ success: false, message: "Accounts team access only" });
  }
  next();
};

// Check if user is faculty or accounts
const isFacultyOrAccounts = (req, res, next) => {
  if (req.user.role !== "faculty" && req.user.role !== "accounts") {
    return res.status(403).json({ success: false, message: "Unauthorized access" });
  }
  next();
};

module.exports = {
  authenticateToken,
  isFaculty,
  isAccounts,
  isFacultyOrAccounts
};