const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  aadhaar: {
    type: String,
    required: false,
    unique: true,
    sparse: true,
    trim: true,
  },
  address: {
    type: String,
    required: false,
    trim: true,
  },
  joiningDate: {
    type: Date,
    default: Date.now,
  },
  photo: {
    type: String, // URL or base64
    required: false,
  },
  currentSeat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Seat",
    default: null,
  },
  feeStatus: {
    type: String,
    enum: ["Paid", "Due"],
    default: "Due",
  },
  totalFeesDue: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
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

studentSchema.index({ phone: 1, userId: 1 });
studentSchema.index({ aadhaar: 1 });

module.exports = mongoose.model("Student", studentSchema);
