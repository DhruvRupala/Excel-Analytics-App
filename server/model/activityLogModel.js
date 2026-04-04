const mongoose = require("mongoose")

const activityLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  action: {
    type: String,
    required: true,
    enum: ["login", "logout", "upload_file", "delete_file", "view_analytics", "ai_analysis", "update_profile"],
  },
  details: {
    type: String, // Contextual string, e.g., "Uploaded file sales_q3.xlsx"
  },
  ipAddress: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

const ActivityLog = mongoose.model("ActivityLog", activityLogSchema)

module.exports = ActivityLog
