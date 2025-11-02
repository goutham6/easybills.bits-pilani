const mongoose = require("mongoose");

const claimSchema = new mongoose.Schema({
  claimNumber: {
    type: String,
    unique: true,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  claimType: {
    type: String,
    enum: ["Travel", "Non Travel", "Forex Refund", "Cell Phone", "Salary/Medical Aid", "F & M (VMS)"],
    required: true
  },
  licenseCategory: {
    type: String,
    required: true
  },
  expenseCategory: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  claimedAmount: {
    type: Number,
    required: true,
    min: 0
  },
  approvedAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  status: {
    type: String,
    enum: ["Draft", "Submitted", "Pending", "Verified", "Referred Back", "Approved", "Rejected/Cancelled", "Paid"],
    default: "Draft"
  },
  pendingWith: {
    type: String,
    default: "NA"
  },
  documents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Document"
  }],
  comments: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    message: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  verifiedAt: Date,
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  approvedAt: Date,
  paidAt: Date,
  rejectionReason: String,
  travelDetails: {
    from: String,
    to: String,
    startDate: Date,
    endDate: Date,
    purpose: String
  }
}, {
  timestamps: true
});

// Auto-generate claim number
claimSchema.pre("save", async function(next) {
  if (!this.claimNumber) {
    const year = new Date().getFullYear().toString().slice(-2);
    const count = await mongoose.model("Claim").countDocuments();
    this.claimNumber = `${count + 1000000}/${year}`;
  }
  next();
});

module.exports = mongoose.model("Claim", claimSchema);