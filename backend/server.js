
const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

// Initialize Express App
const app = express();

// ════════════════════════════════════════════════════════════════
// MIDDLEWARE
// ════════════════════════════════════════════════════════════════

// CORS - Allow frontend to communicate with backend
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  }),
);

// Parse JSON requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ════════════════════════════════════════════════════════════════
// ROUTES
// ════════════════════════════════════════════════════════════════

// Auth Routes
app.use("/api/auth", require("./routes/auth"));

// Student Routes
app.use("/api/students", require("./routes/students"));

// Seat Routes
app.use("/api/seats", require("./routes/seats"));

// Fee Routes
app.use("/api/fees", require("./routes/fees"));

// Report Routes
app.use("/api/reports", require("./routes/reports"));

// Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "Server is running", timestamp: new Date() });
});

// ════════════════════════════════════════════════════════════════
// ERROR HANDLING MIDDLEWARE
// ════════════════════════════════════════════════════════════════

// 404 - Not Found
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.originalUrl,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("❌ Error:", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    error: process.env.NODE_ENV === "production" ? {} : err,
  });
});

// ════════════════════════════════════════════════════════════════
// START SERVER
// ════════════════════════════════════════════════════════════════

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`
  ╔══════════════════════════════════════════════════════════╗
  ║  📚 Library Management System - Backend Server          ║
  ║  🚀 Server running on http://localhost:${PORT}            ║
  ║  📊 Database: MongoDB                                    ║
  ║  🔌 Environment: ${process.env.NODE_ENV || "development"}                    ║
  ╚══════════════════════════════════════════════════════════╝
  `);
});
