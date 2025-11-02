const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  claimId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Claim"
  },
  action: {
    type: String,
    required: true,
    enum: [
      "claim_created",
      "claim_submitted",
      "claim_updated",
      "claim_verified",
      "claim_approved",
      "claim_rejected",
      "claim_rejected/cancelled",
      "claim_referred_back",
      "claim_referred back",
      "claim_paid",
      "document_uploaded",
      "document_deleted",
      "comment_added",
      "status_changed"
    ]
  },
  details: {
    type: String
  },
  previousValue: mongoose.Schema.Types.Mixed,
  newValue: mongoose.Schema.Types.Mixed,
  ipAddress: String,
  userAgent: String
}, {
  timestamps: true
});

module.exports = mongoose.model("AuditLog", auditLogSchema);