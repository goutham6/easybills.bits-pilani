const express = require("express");
const router = express.Router();
const Claim = require("../models/Claim");
const Document = require("../models/Document");
const Notification = require("../models/Notification");
const AuditLog = require("../models/AuditLog");
const { authenticateToken, isFaculty, isAccounts } = require("./authMiddleware");
const upload = require("../config/multer");

// Helper function to create notification
const createNotification = async (userId, claimId, type, title, message) => {
  try {
    const notification = new Notification({
      userId,
      claimId,
      type,
      title,
      message
    });
    await notification.save();
  } catch (err) {
    console.error("Error creating notification:", err);
  }
};

// Helper function to create audit log
const createAuditLog = async (userId, claimId, action, details, req) => {
  try {
    const auditLog = new AuditLog({
      userId,
      claimId,
      action,
      details,
      ipAddress: req.ip,
      userAgent: req.get("user-agent")
    });
    await auditLog.save();
  } catch (err) {
    console.error("Error creating audit log:", err);
  }
};

// GET all claims for logged-in user
router.get("/", authenticateToken, async (req, res) => {
  try {
    const { status, claimType, startDate, endDate } = req.query;
    
    let query = { userId: req.user.userId };
    
    // Add filters
    if (status) query.status = status;
    if (claimType) query.claimType = claimType;
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const claims = await Claim.find(query)
      .populate("documents")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: claims.length,
      claims
    });
  } catch (err) {
    console.error("Error fetching claims:", err);
    res.status(500).json({ success: false, message: "Error fetching claims", error: err.message });
  }
});

// GET single claim by ID
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const claim = await Claim.findById(req.params.id)
      .populate("userId", "name email employeeId")
      .populate("documents")
      .populate("verifiedBy", "name email")
      .populate("approvedBy", "name email")
      .populate("comments.userId", "name email");

    if (!claim) {
      return res.status(404).json({ success: false, message: "Claim not found" });
    }

    // Check if user owns the claim or is accounts team
    if (claim.userId._id.toString() !== req.user.userId && req.user.role !== "accounts") {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    res.json({ success: true, claim });
  } catch (err) {
    console.error("Error fetching claim:", err);
    res.status(500).json({ success: false, message: "Error fetching claim", error: err.message });
  }
});

// POST create new claim
router.post("/", authenticateToken, isFaculty, async (req, res) => {
  try {
    const {
      claimType,
      licenseCategory,
      expenseCategory,
      description,
      claimedAmount,
      travelDetails
    } = req.body;

    // Validate required fields
    if (!claimType || !licenseCategory || !expenseCategory || !description || !claimedAmount) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided"
      });
    }

    // Create claim
    const claim = new Claim({
      userId: req.user.userId,
      claimType,
      licenseCategory,
      expenseCategory,
      description,
      claimedAmount,
      travelDetails: claimType === "Travel" ? travelDetails : undefined,
      status: "Draft"
    });

    await claim.save();

    // Create audit log
    await createAuditLog(
      req.user.userId,
      claim._id,
      "claim_created",
      `Claim ${claim.claimNumber} created`,
      req
    );

    res.status(201).json({
      success: true,
      message: "Claim created successfully",
      claim
    });
  } catch (err) {
    console.error("Error creating claim:", err);
    res.status(500).json({ success: false, message: "Error creating claim", error: err.message });
  }
});

// PUT update claim (only if status is Draft)
router.put("/:id", authenticateToken, isFaculty, async (req, res) => {
  try {
    const claim = await Claim.findById(req.params.id);

    if (!claim) {
      return res.status(404).json({ success: false, message: "Claim not found" });
    }

    // Check ownership
    if (claim.userId.toString() !== req.user.userId) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    // Only allow updates if status is Draft
    if (claim.status !== "Draft") {
      return res.status(400).json({
        success: false,
        message: "Only draft claims can be edited"
      });
    }

    // Update fields
    const allowedUpdates = [
      "claimType",
      "licenseCategory",
      "expenseCategory",
      "description",
      "claimedAmount",
      "travelDetails"
    ];

    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        claim[field] = req.body[field];
      }
    });

    await claim.save();

    // Create audit log
    await createAuditLog(
      req.user.userId,
      claim._id,
      "claim_updated",
      `Claim ${claim.claimNumber} updated`,
      req
    );

    res.json({
      success: true,
      message: "Claim updated successfully",
      claim
    });
  } catch (err) {
    console.error("Error updating claim:", err);
    res.status(500).json({ success: false, message: "Error updating claim", error: err.message });
  }
});

// POST submit claim (change status from Draft to Submitted)
router.post("/:id/submit", authenticateToken, isFaculty, async (req, res) => {
  try {
    const claim = await Claim.findById(req.params.id);

    if (!claim) {
      return res.status(404).json({ success: false, message: "Claim not found" });
    }

    // Check ownership
    if (claim.userId.toString() !== req.user.userId) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    // Check if claim has documents
    if (claim.documents.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please upload at least one document before submitting"
      });
    }

    // Update status
    claim.status = "Submitted";
    claim.pendingWith = "Accounts Team";
    await claim.save();

    // Create notification for accounts team (you'll need to get accounts team users)
    await createNotification(
      claim.userId,
      claim._id,
      "claim_submitted",
      "Claim Submitted",
      `Your claim ${claim.claimNumber} has been submitted successfully`
    );

    // Create audit log
    await createAuditLog(
      req.user.userId,
      claim._id,
      "claim_submitted",
      `Claim ${claim.claimNumber} submitted for verification`,
      req
    );

    res.json({
      success: true,
      message: "Claim submitted successfully",
      claim
    });
  } catch (err) {
    console.error("Error submitting claim:", err);
    res.status(500).json({ success: false, message: "Error submitting claim", error: err.message });
  }
});

// POST upload document for a claim
router.post("/:id/documents", authenticateToken, isFaculty, upload.single("document"), async (req, res) => {
  try {
    const claim = await Claim.findById(req.params.id);

    if (!claim) {
      return res.status(404).json({ success: false, message: "Claim not found" });
    }

    // Check ownership
    if (claim.userId.toString() !== req.user.userId) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    // Create document record
    const document = new Document({
      claimId: claim._id,
      userId: req.user.userId,
      filename: req.file.filename,
      originalName: req.file.originalname,
      fileType: req.file.mimetype.split("/")[1],
      fileSize: req.file.size,
      fileUrl: `/uploads/${req.file.filename}`,
      documentType: req.body.documentType || "receipt"
    });

    await document.save();

    // Add document to claim
    claim.documents.push(document._id);
    await claim.save();

    // Create audit log
    await createAuditLog(
      req.user.userId,
      claim._id,
      "document_uploaded",
      `Document ${document.originalName} uploaded to claim ${claim.claimNumber}`,
      req
    );

    res.status(201).json({
      success: true,
      message: "Document uploaded successfully",
      document
    });
  } catch (err) {
    console.error("Error uploading document:", err);
    res.status(500).json({ success: false, message: "Error uploading document", error: err.message });
  }
});

// POST add comment to claim
router.post("/:id/comments", authenticateToken, async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ success: false, message: "Comment message is required" });
    }

    const claim = await Claim.findById(req.params.id);

    if (!claim) {
      return res.status(404).json({ success: false, message: "Claim not found" });
    }

    // Add comment
    claim.comments.push({
      userId: req.user.userId,
      message,
      createdAt: new Date()
    });

    await claim.save();

    // Create notification for claim owner
    if (claim.userId.toString() !== req.user.userId) {
      await createNotification(
        claim.userId,
        claim._id,
        "comment_added",
        "New Comment on Your Claim",
        `A comment was added to claim ${claim.claimNumber}`
      );
    }

    // Create audit log
    await createAuditLog(
      req.user.userId,
      claim._id,
      "comment_added",
      `Comment added to claim ${claim.claimNumber}`,
      req
    );

    res.json({
      success: true,
      message: "Comment added successfully",
      claim
    });
  } catch (err) {
    console.error("Error adding comment:", err);
    res.status(500).json({ success: false, message: "Error adding comment", error: err.message });
  }
});

// ===== ACCOUNTS TEAM ROUTES =====

// GET all pending claims (for accounts team)
router.get("/accounts/pending", authenticateToken, isAccounts, async (req, res) => {
  try {
    const claims = await Claim.find({ status: { $in: ["Submitted", "Pending"] } })
      .populate("userId", "name email employeeId department")
      .populate("documents")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: claims.length,
      claims
    });
  } catch (err) {
    console.error("Error fetching pending claims:", err);
    res.status(500).json({ success: false, message: "Error fetching claims", error: err.message });
  }
});

// PUT verify/approve claim (accounts team)
router.put("/:id/verify", authenticateToken, isAccounts, async (req, res) => {
  try {
    const { status, approvedAmount, rejectionReason } = req.body;

    const claim = await Claim.findById(req.params.id);

    if (!claim) {
      return res.status(404).json({ success: false, message: "Claim not found" });
    }

    // Update claim based on action
    if (status === "Verified") {
      claim.status = "Verified";
      claim.verifiedBy = req.user.userId;
      claim.verifiedAt = new Date();
      claim.pendingWith = "Finance Team";
    } else if (status === "Approved") {
      claim.status = "Approved";
      claim.approvedBy = req.user.userId;
      claim.approvedAt = new Date();
      claim.approvedAmount = approvedAmount || claim.claimedAmount;
      claim.pendingWith = "Payment Processing";
    } else if (status === "Referred Back") {
      claim.status = "Referred Back";
      claim.pendingWith = "Faculty";
      claim.rejectionReason = rejectionReason;
    } else if (status === "Rejected/Cancelled") {
      claim.status = "Rejected/Cancelled";
      claim.pendingWith = "NA";
      claim.rejectionReason = rejectionReason;
    }

    await claim.save();

    // Create notification for faculty
    await createNotification(
      claim.userId,
      claim._id,
      `claim_${status.toLowerCase().replace(" ", "_")}`,
      `Claim ${status}`,
      `Your claim ${claim.claimNumber} has been ${status.toLowerCase()}`
    );

    // Create audit log
    await createAuditLog(
      req.user.userId,
      claim._id,
      `claim_${status.toLowerCase().replace(" ", "_")}`,
      `Claim ${claim.claimNumber} ${status.toLowerCase()} by accounts team`,
      req
    );

    res.json({
      success: true,
      message: `Claim ${status.toLowerCase()} successfully`,
      claim
    });
  } catch (err) {
    console.error("Error verifying claim:", err);
    res.status(500).json({ success: false, message: "Error verifying claim", error: err.message });
  }
});

module.exports = router;