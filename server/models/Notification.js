const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  claimId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Claim"
  },
  type: {
    type: String,
    enum: ["claim_submitted", "claim_verified", "claim_approved", "claim_rejected", "claim_rejected/cancelled", "claim_referred_back", "claim_referred back", "claim_paid", "comment_added"],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: Date
}, {
  timestamps: true
});

module.exports = mongoose.model("Notification", notificationSchema);