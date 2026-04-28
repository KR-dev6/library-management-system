const express = require("express");
const router = express.Router();
const Fee = require("../models/Fee");
const Student = require("../models/Student");
const {
  authMiddleware,
  adminMiddleware,
  studentMiddleware,
} = require("../middleware/auth");

/**
 * @route   GET /api/fees
 * @desc    Get all fees (admin only)
 * @access  Private - Admin
 */
router.get("/", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const fees = await Fee.find().populate("student", "name phone");

    res.json({
      success: true,
      message: "Fees fetched successfully",
      data: fees,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch fees",
      error: error.message,
    });
  }
});

/**
 * @route   GET /api/fees/student/:studentId
 * @desc    Get fees for specific student
 * @access  Private
 */
router.get("/student/:studentId", authMiddleware, async (req, res) => {
  try {
    const fees = await Fee.find({ student: req.params.studentId });

    res.json({
      success: true,
      message: "Student fees fetched successfully",
      data: fees,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch fees",
      error: error.message,
    });
  }
});

/**
 * @route   POST /api/fees
 * @desc    Create new fee record (admin only)
 * @access  Private - Admin
 */
router.post("/", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const {
      student,
      amount,
      month,
      paymentDate,
      status,
      paymentMethod,
      notes,
    } = req.body;

    // Validation
    if (!student || !amount || !month) {
      return res.status(400).json({
        success: false,
        message: "Student, amount, and month are required",
      });
    }

    // Check if student exists
    const studentExists = await Student.findById(student);
    if (!studentExists) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    const fee = new Fee({
      student,
      amount,
      month,
      paymentDate: paymentDate || (status === "Paid" ? Date.now() : null),
      status: status || "Due",
      paymentMethod: paymentMethod || "Cash",
      notes,
    });

    await fee.save();

    // Update student fee status if all fees are paid
    const remainingDueFees = await Fee.countDocuments({
      student,
      status: "Due",
    });
    if (remainingDueFees === 0) {
      studentExists.feeStatus = "Paid";
    }
    await studentExists.save();

    res.status(201).json({
      success: true,
      message: "Fee record created successfully",
      data: fee,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create fee record",
      error: error.message,
    });
  }
});

/**
 * @route   PUT /api/fees/:id
 * @desc    Update fee record (admin only)
 * @access  Private - Admin
 */
router.put("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { amount, status, paymentDate, paymentMethod, notes } = req.body;

    let fee = await Fee.findById(req.params.id);

    if (!fee) {
      return res.status(404).json({
        success: false,
        message: "Fee record not found",
      });
    }

    if (amount) fee.amount = amount;
    if (status) fee.status = status;
    if (paymentDate && status === "Paid") fee.paymentDate = paymentDate;
    if (paymentMethod) fee.paymentMethod = paymentMethod;
    if (notes !== undefined) fee.notes = notes;

    fee.updatedAt = Date.now();
    await fee.save();

    // Update student fee status
    const student = await Student.findById(fee.student);
    if (student) {
      const remainingDueFees = await Fee.countDocuments({
        student: fee.student,
        status: "Due",
      });
      student.feeStatus = remainingDueFees === 0 ? "Paid" : "Due";
      student.totalFeesDue = await Fee.aggregate([
        { $match: { student: student._id, status: "Due" } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]);
      student.totalFeesDue = student.totalFeesDue[0]?.total || 0;
      await student.save();
    }

    res.json({
      success: true,
      message: "Fee record updated successfully",
      data: fee,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update fee record",
      error: error.message,
    });
  }
});

/**
 * @route   DELETE /api/fees/:id
 * @desc    Delete fee record (admin only)
 * @access  Private - Admin
 */
router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const fee = await Fee.findByIdAndDelete(req.params.id);

    if (!fee) {
      return res.status(404).json({
        success: false,
        message: "Fee record not found",
      });
    }

    res.json({
      success: true,
      message: "Fee record deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete fee record",
      error: error.message,
    });
  }
});

/**
 * @route   GET /api/fees/due
 * @desc    Get all due fees (admin only)
 * @access  Private - Admin
 */
router.get("/due", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const dueFees = await Fee.find({ status: "Due" }).populate(
      "student",
      "name phone",
    );

    const totalDue = dueFees.reduce((sum, fee) => sum + fee.amount, 0);

    res.json({
      success: true,
      message: "Due fees fetched successfully",
      data: {
        fees: dueFees,
        totalAmount: totalDue,
        count: dueFees.length,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch due fees",
      error: error.message,
    });
  }
});

module.exports = router;
