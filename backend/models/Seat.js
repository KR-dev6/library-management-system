const mongoose = require("mongoose");

const seatSchema = new mongoose.Schema({
  seatNumber: {
    type: Number,
    required: true,
    unique: true,
  },
  status: {
    type: String,
    enum: ["Available", "Occupied"],
    default: "Available",
  },
  assignedStudent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    default: null,
  },
  assignedDate: {
    type: Date,
    default: null,
  },
  monthlyRate: {
    type: Number,
    default: 1200, // Default monthly fee
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

seatSchema.index({ seatNumber: 1 });
seatSchema.index({ status: 1 });

module.exports = mongoose.model("Seat", seatSchema);
