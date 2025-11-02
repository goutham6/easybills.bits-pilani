const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema({
  claimId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Claim",
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  filename: {
    type: String,
    required: true
  },
  originalName: {
    type: String,
    required: true
  },
  fileType: {
    type: String,
    enum: ["pdf", "jpg", "jpeg", "png"],
    required: true
  },
  fileSize: {
    type: Number,
    required: true
  },
  fileUrl: {
    type: String,
    required: true
  },
  documentType: {
    type: String,
    enum: ["receipt", "invoice", "ticket", "bill", "other"],
    default: "receipt"
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("Document", documentSchema);