const mongoose = require("mongoose")

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ["info", "success", "warning", "error", "system"],
    default: "info",
  },
  message: {
    type: String,
    required: true,
  },
  read: {
    type: Boolean,
    default: false,
  },
  link: {
    type: String, // Optional URL to navigate to when clicked
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

const Notification = mongoose.model("Notification", notificationSchema)

module.exports = Notification
