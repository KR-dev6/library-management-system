const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Student = require("../models/Student");
const { authMiddleware } = require("../middleware/auth");

/**
 * @route   POST /api/auth/admin-login
 * @desc    Login for admin users
 * @access  Public
 */
router.post("/admin-login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validation
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required",
      });
    }

    // Find user
    const user = await User.findOne({ username, role: "admin" }).select(
      "+password",
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || "7d" },
    );

    res.json({
      success: true,
      message: "Admin login successful",
      data: {
        token,
        user: user.toJSON(),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message,
    });
  }
});

/**
 * @route   POST /api/auth/student-login
 * @desc    Login for student users using phone/aadhaar and password
 * @access  Public
 */
router.post("/student-login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validation
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Phone/Aadhaar and password are required",
      });
    }

    // Find student by phone or aadhaar (username field contains phone/aadhaar for students)
    let student = await Student.findOne({
      $or: [{ phone: username }, { aadhaar: username }],
    });

    if (!student) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials. Student not found.",
      });
    }

    // Get associated user
    const user = await User.findById(student.userId).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User account not found. Please contact admin.",
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Check if student record is active (was deleted)
    if (student.isActive === false) {
      return res.status(401).json({
        success: false,
        message: "This student account has been deactivated. Please contact admin.",
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user._id,
        username: user.username,
        role: user.role,
        studentId: student._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || "7d" },
    );

    res.json({
      success: true,
      message: "Student login successful",
      data: {
        token,
        user: user.toJSON(),
        student: student,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message,
    });
  }
});

/**
 * @route   POST /api/auth/register
 * @desc    Register a new student
 * @access  Public
 */
router.post("/register", async (req, res) => {
  try {
    const { username, password, name, phone, aadhaar, address } = req.body;

    // Validation
    if (!username || !password || !name || !phone) {
      return res.status(400).json({
        success: false,
        message: "Username, password, name, and phone are required",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Username already exists",
      });
    }

    // Create user
    const user = new User({
      username,
      password,
      role: "student",
    });

    await user.save();

    // Create student profile
    const student = new Student({
      userId: user._id,
      name,
      phone,
      aadhaar,
      address,
    });

    await student.save();

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user._id,
        username: user.username,
        role: user.role,
        studentId: student._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || "7d" },
    );

    res.status(201).json({
      success: true,
      message: "Student registered successfully",
      data: {
        token,
        user: user.toJSON(),
        student: student,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Registration failed",
      error: error.message,
    });
  }
});

/**
 * @route   GET /api/auth/me
 * @desc    Get current user
 * @access  Private
 */
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // If student, get student details
    let student = null;
    if (user.role === "student") {
      student = await Student.findOne({ userId: user._id }).populate(
        "currentSeat",
      );
    }

    res.json({
      success: true,
      data: {
        user: user.toJSON(),
        student: student,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch user",
      error: error.message,
    });
  }
});

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user (frontend clears token)
 * @access  Private
 */
router.post("/logout", authMiddleware, (req, res) => {
  res.json({
    success: true,
    message: "Logout successful. Please clear your token from localStorage.",
  });
});

module.exports = router;
