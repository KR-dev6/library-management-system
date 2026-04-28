const express = require("express");
const router = express.Router();
const Seat = require("../models/Seat");
const Student = require("../models/Student");
const Booking = require("../models/Booking");
const { authMiddleware, adminMiddleware } = require("../middleware/auth");

/**
 * @route   GET /api/seats
 * @desc    Get all seats
 * @access  Private
 */
router.get("/", authMiddleware, async (req, res) => {
  try {
    const seats = await Seat.find().populate("assignedStudent", "name phone");

    res.json({
      success: true,
      message: "Seats fetched successfully",
      data: seats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch seats",
      error: error.message,
    });
  }
});

/**
 * @route   POST /api/seats
 * @desc    Create new seat (admin only)
 * @access  Private - Admin
 */
router.post("/", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { seatNumber, monthlyRate } = req.body;

    // Validation
    if (!seatNumber) {
      return res.status(400).json({
        success: false,
        message: "Seat number is required",
      });
    }

    // Check if seat already exists
    const existingSeat = await Seat.findOne({ seatNumber });
    if (existingSeat) {
      return res.status(400).json({
        success: false,
        message: "Seat already exists",
      });
    }

    const seat = new Seat({
      seatNumber,
      monthlyRate: monthlyRate || 1200,
    });

    await seat.save();

    res.status(201).json({
      success: true,
      message: "Seat created successfully",
      data: seat,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create seat",
      error: error.message,
    });
  }
});

/**
 * @route   PUT /api/seats/:id
 * @desc    Update seat (admin only)
 * @access  Private - Admin
 */
router.put("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { monthlyRate, notes } = req.body;

    let seat = await Seat.findById(req.params.id);

    if (!seat) {
      return res.status(404).json({
        success: false,
        message: "Seat not found",
      });
    }

    if (monthlyRate) seat.monthlyRate = monthlyRate;
    if (notes !== undefined) seat.notes = notes;

    seat.updatedAt = Date.now();
    await seat.save();

    res.json({
      success: true,
      message: "Seat updated successfully",
      data: seat,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update seat",
      error: error.message,
    });
  }
});

/**
 * @route   DELETE /api/seats/:id
 * @desc    Delete seat (admin only)
 * @access  Private - Admin
 */
router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const seat = await Seat.findByIdAndDelete(req.params.id);

    if (!seat) {
      return res.status(404).json({
        success: false,
        message: "Seat not found",
      });
    }

    res.json({
      success: true,
      message: "Seat deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete seat",
      error: error.message,
    });
  }
});

/**
 * @route   POST /api/seats/assign
 * @desc    Assign seat to student (admin only)
 * @access  Private - Admin
 */
router.post(
  "/assign/:seatId/:studentId",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const { seatId, studentId } = req.params;

      // Validate seat and student exist
      const seat = await Seat.findById(seatId);
      const student = await Student.findById(studentId);

      if (!seat) {
        return res.status(404).json({
          success: false,
          message: "Seat not found",
        });
      }

      if (!student) {
        return res.status(404).json({
          success: false,
          message: "Student not found",
        });
      }

      // Check if seat is already occupied
      if (
        seat.status === "Occupied" &&
        seat.assignedStudent?.toString() !== studentId
      ) {
        return res.status(400).json({
          success: false,
          message: "Seat is already occupied",
        });
      }

      // Release previous seat if student had one
      if (student.currentSeat) {
        const previousSeat = await Seat.findById(student.currentSeat);
        if (previousSeat) {
          previousSeat.status = "Available";
          previousSeat.assignedStudent = null;
          previousSeat.assignedDate = null;
          await previousSeat.save();

          // Close previous booking
          await Booking.updateOne(
            { student: studentId, seat: student.currentSeat, status: "Active" },
            { status: "Closed", checkOutDate: Date.now() },
          );
        }
      }

      // Assign new seat
      seat.status = "Occupied";
      seat.assignedStudent = studentId;
      seat.assignedDate = Date.now();
      await seat.save();

      // Update student
      student.currentSeat = seatId;
      await student.save();

      // Create booking record
      const booking = new Booking({
        student: studentId,
        seat: seatId,
        checkInDate: Date.now(),
        status: "Active",
      });
      await booking.save();

      res.json({
        success: true,
        message: "Seat assigned successfully",
        data: {
          seat: await seat.populate("assignedStudent"),
          student,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to assign seat",
        error: error.message,
      });
    }
  },
);

/**
 * @route   POST /api/seats/release/:seatId
 * @desc    Release seat from student (admin only)
 * @access  Private - Admin
 */
router.post(
  "/release/:seatId",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const { seatId } = req.params;

      const seat = await Seat.findById(seatId);

      if (!seat) {
        return res.status(404).json({
          success: false,
          message: "Seat not found",
        });
      }

      const studentId = seat.assignedStudent;

      // Release seat
      seat.status = "Available";
      seat.assignedStudent = null;
      seat.assignedDate = null;
      await seat.save();

      // Update student
      if (studentId) {
        const student = await Student.findById(studentId);
        if (student) {
          student.currentSeat = null;
          await student.save();
        }

        // Close booking
        await Booking.updateOne(
          { student: studentId, seat: seatId, status: "Active" },
          { status: "Closed", checkOutDate: Date.now() },
        );
      }

      res.json({
        success: true,
        message: "Seat released successfully",
        data: seat,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to release seat",
        error: error.message,
      });
    }
  },
);

module.exports = router;
