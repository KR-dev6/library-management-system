const jwt = require("jsonwebtoken");

/**
 * Middleware to verify JWT token
 * Protects routes that require authentication
 */
const authMiddleware = (req, res, next) => {
  try {
    // Get token from header
    const token = req.headers.authorization?.split(" ")[1]; // "Bearer <token>"

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided, authorization denied",
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Store decoded data in request
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Invalid or expired token",
      error: error.message,
    });
  }
};

/**
 * Middleware to verify admin role
 */
const adminMiddleware = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admin role required.",
    });
  }
  next();
};

/**
 * Middleware to verify student role
 */
const studentMiddleware = (req, res, next) => {
  if (req.user?.role !== "student") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Student role required.",
    });
  }
  next();
};

module.exports = {
  authMiddleware,
  adminMiddleware,
  studentMiddleware,
};
