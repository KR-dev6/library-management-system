const express = require("express");
const router = express.Router();
const Student = require("../models/Student");
const Seat = require("../models/Seat");
const Fee = require("../models/Fee");
const {
  authMiddleware,
  adminMiddleware,
  studentMiddleware,
} = require("../middleware/auth");

/**
 * @route   GET /api/students
 * @desc    Get all students (admin only)
 * @access  Private - Admin
 */
router.get("/", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const students = await Student.find({ isActive: true })
      .populate("userId", "username email")
      .populate("currentSeat", "seatNumber status");

    res.json({
      success: true,
      message: "Students fetched successfully",
      data: students,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch students",
      error: error.message,
    });
  }
});

/**
 * @route   GET /api/students/:id
 * @desc    Get student by ID
 * @access  Private
 */
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const student = await Student.findById(req.params.id)
      .populate("userId", "username email")
      .populate("currentSeat", "seatNumber status");

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.json({
      success: true,
      data: student,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch student",
      error: error.message,
    });
  }
});

/**
 * @route   POST /api/students
 * @desc    Create new student (admin only)
 * @access  Private - Admin
 */
router.post("/", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { userId, name, phone, aadhaar, address, joiningDate } = req.body;

    // Validation
    if (!name || !phone) {
      return res.status(400).json({
        success: false,
        message: "Name and phone are required",
      });
    }

    // Check if phone already exists
    const existingPhone = await Student.findOne({ phone });
    if (existingPhone) {
      return res.status(400).json({
        success: false,
        message: "Phone number already exists",
      });
    }

    const student = new Student({
      userId,
      name,
      phone,
      aadhaar,
      address,
      joiningDate: joiningDate || Date.now(),
    });

    await student.save();

    res.status(201).json({
      success: true,
      message: "Student created successfully",
      data: student,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create student",
      error: error.message,
    });
  }
});

/**
 * @route   PUT /api/students/:id
 * @desc    Update student (admin only)
 * @access  Private - Admin
 */
router.put("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { name, phone, aadhaar, address, feeStatus } = req.body;

    let student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // Update fields
    if (name) student.name = name;
    if (phone) student.phone = phone;
    if (aadhaar) student.aadhaar = aadhaar;
    if (address) student.address = address;
    if (feeStatus) student.feeStatus = feeStatus;

    student.updatedAt = Date.now();
    await student.save();

    res.json({
      success: true,
      message: "Student updated successfully",
      data: student,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update student",
      error: error.message,
    });
  }
});

/**
 * @route   DELETE /api/students/:id
 * @desc    Delete student (admin only)
 * @access  Private - Admin
 */
router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // Soft delete - mark as inactive
    student.isActive = false;
    await student.save();

    res.json({
      success: true,
      message: "Student deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete student",
      error: error.message,
    });
  }
});

/**
 * @route   GET /api/students/:id/dashboard
 * @desc    Get student dashboard (student only)
 * @access  Private - Student
 */
router.get(
  "/:id/dashboard",
  authMiddleware,
  studentMiddleware,
  async (req, res) => {
    try {
      const student = await Student.findById(req.params.id)
        .populate("currentSeat")
        .populate("userId", "username email");

      if (!student) {
        return res.status(404).json({
          success: false,
          message: "Student not found",
        });
      }

      // Get student fees
      const fees = await Fee.find({ student: req.params.id });
      const totalDue = fees
        .filter((f) => f.status === "Due")
        .reduce((sum, f) => sum + f.amount, 0);

      res.json({
        success: true,
        data: {
          student,
          fees,
          totalFeeDue: totalDue,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch dashboard",
        error: error.message,
      });
    }
  },
);

module.exports = router;
