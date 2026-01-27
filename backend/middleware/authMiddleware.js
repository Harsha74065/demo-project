const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Verify JWT token
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "dexter_delta_secret_key_2026");
    
    // Check if user exists and is not blocked
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    if (user.status === "blocked") {
      return res.status(403).json({ message: "Your account has been blocked" });
    }

    req.user = { id: user._id, role: user.role, name: user.name };
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

// Check if user is admin
const adminMiddleware = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
};

module.exports = { authMiddleware, adminMiddleware };
