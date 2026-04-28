const mongoose = require("mongoose");

const feeSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  month: {
    type: String, // Format: "2024-04"
    required: true,
  },
  paymentDate: {
    type: Date,
    required: false,
  },
  status: {
    type: String,
    enum: ["Paid", "Due"],
    default: "Due",
  },
  paymentMethod: {
    type: String,
    enum: ["Cash", "Online", "Cheque"],
    default: "Cash",
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

feeSchema.index({ student: 1, month: 1 });
feeSchema.index({ status: 1 });
feeSchema.index({ paymentDate: 1 });

module.exports = mongoose.model("Fee", feeSchema);
