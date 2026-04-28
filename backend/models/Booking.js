const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  seat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Seat",
    required: true,
  },
  checkInDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  checkOutDate: {
    type: Date,
    default: null,
  },
  status: {
    type: String,
    enum: ["Active", "Closed"],
    default: "Active",
  },
  notes: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// ════════════════════════════════════════════════════════════════
// INDEX: For faster queries
// ════════════════════════════════════════════════════════════════

bookingSchema.index({ student: 1, status: 1 });
bookingSchema.index({ seat: 1 });
bookingSchema.index({ checkInDate: 1 });

module.exports = mongoose.model("Booking", bookingSchema);
