const express = require("express");
const router = express.Router();
const Student = require("../models/Student");
const Seat = require("../models/Seat");
const Fee = require("../models/Fee");
const Booking = require("../models/Booking");
const { authMiddleware, adminMiddleware } = require("../middleware/auth");

/**
 * @route   GET /api/reports/dashboard
 * @desc    Get dashboard statistics
 * @access  Private - Admin
 */
router.get("/dashboard", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments({ isActive: true });
    const totalSeats = await Seat.countDocuments();
    const occupiedSeats = await Seat.countDocuments({ status: "Occupied" });
    const availableSeats = totalSeats - occupiedSeats;

    const totalFees = await Fee.aggregate([
      { $match: { status: "Paid" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const feesData = totalFees[0] || { total: 0 };

    const totalDueFees = await Fee.aggregate([
      { $match: { status: "Due" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const dueFeesData = totalDueFees[0] || { total: 0 };

    const occupancyRate =
      totalSeats > 0 ? ((occupiedSeats / totalSeats) * 100).toFixed(2) : 0;

    res.json({
      success: true,
      message: "Dashboard statistics fetched successfully",
      data: {
        totalStudents,
        totalSeats,
        occupiedSeats,
        availableSeats,
        occupancyRate: parseFloat(occupancyRate),
        totalRevenue: feesData.total,
        totalDueRevenue: dueFeesData.total,
        totalRevenuePotential: feesData.total + dueFeesData.total,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard statistics",
      error: error.message,
    });
  }
});

/**
 * @route   GET /api/reports/students
 * @desc    Get student summary report
 * @access  Private - Admin
 */
router.get("/students", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const students = await Student.find({ isActive: true })
      .populate("currentSeat", "seatNumber")
      .populate("userId", "username");

    const studentsWithFeeStatus = await Promise.all(
      students.map(async (student) => {
        const fees = await Fee.find({ student: student._id });
        const totalDue = fees
          .filter((f) => f.status === "Due")
          .reduce((sum, f) => sum + f.amount, 0);

        return {
          _id: student._id,
          name: student.name,
          phone: student.phone,
          currentSeat: student.currentSeat?.seatNumber || "Not Assigned",
          feeStatus: student.feeStatus,
          totalFeeDue: totalDue,
          joiningDate: student.joiningDate,
        };
      }),
    );

    res.json({
      success: true,
      message: "Student summary fetched successfully",
      data: studentsWithFeeStatus,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch student summary",
      error: error.message,
    });
  }
});

/**
 * @route   GET /api/reports/revenue
 * @desc    Get revenue summary report
 * @access  Private - Admin
 */
router.get("/revenue", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const fees = await Fee.find();

    const paidFees = fees.filter((f) => f.status === "Paid");
    const dueFees = fees.filter((f) => f.status === "Due");

    const totalRevenue = paidFees.reduce((sum, f) => sum + f.amount, 0);
    const totalDue = dueFees.reduce((sum, f) => sum + f.amount, 0);

    // Revenue by month
    const revenueByMonth = {};
    paidFees.forEach((fee) => {
      const month = fee.month;
      revenueByMonth[month] = (revenueByMonth[month] || 0) + fee.amount;
    });

    res.json({
      success: true,
      message: "Revenue summary fetched successfully",
      data: {
        totalRevenue,
        totalDue,
        totalPotential: totalRevenue + totalDue,
        paidCount: paidFees.length,
        dueCount: dueFees.length,
        revenueByMonth: Object.entries(revenueByMonth).map(
          ([month, amount]) => ({
            month,
            amount,
          }),
        ),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch revenue summary",
      error: error.message,
    });
  }
});

/**
 * @route   GET /api/reports/occupancy
 * @desc    Get seat occupancy report
 * @access  Private - Admin
 */
router.get("/occupancy", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const seats = await Seat.find().populate("assignedStudent", "name phone");

    const occupied = seats.filter((s) => s.status === "Occupied");
    const available = seats.filter((s) => s.status === "Available");

    const occupancyRate =
      seats.length > 0
        ? ((occupied.length / seats.length) * 100).toFixed(2)
        : 0;

    res.json({
      success: true,
      message: "Occupancy report fetched successfully",
      data: {
        totalSeats: seats.length,
        occupiedSeats: occupied.length,
        availableSeats: available.length,
        occupancyRate: parseFloat(occupancyRate),
        seats: seats.map((s) => ({
          seatNumber: s.seatNumber,
          status: s.status,
          assignedStudent: s.assignedStudent
            ? {
                name: s.assignedStudent.name,
                phone: s.assignedStudent.phone,
              }
            : null,
          monthlyRate: s.monthlyRate,
        })),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch occupancy report",
      error: error.message,
    });
  }
});

/**
 * @route   GET /api/reports/bookings
 * @desc    Get booking history
 * @access  Private - Admin
 */
router.get("/bookings", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("student", "name phone")
      .populate("seat", "seatNumber")
      .sort({ checkInDate: -1 });

    const activeBookings = bookings.filter((b) => b.status === "Active");
    const closedBookings = bookings.filter((b) => b.status === "Closed");

    res.json({
      success: true,
      message: "Booking history fetched successfully",
      data: {
        activeBookings,
        closedBookings,
        totalBookings: bookings.length,
        activeCount: activeBookings.length,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch booking history",
      error: error.message,
    });
  }
});

module.exports = router;
