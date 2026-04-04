const ActivityLog = require("../model/activityLogModel")
const Notification = require("../model/notificationModel")

// Helper function to log user activity
const logActivity = async (userId, action, details = "", ipAddress = "") => {
  try {
    const log = new ActivityLog({
      user: userId,
      action,
      details,
      ipAddress
    })
    await log.save()
  } catch (error) {
    console.error("Error logging activity:", error)
  }
}

// Helper function to create a notification
const createNotification = async (userId, type, message, link = "") => {
  try {
    const notification = new Notification({
      user: userId,
      type,
      message,
      link
    })
    await notification.save()
  } catch (error) {
    console.error("Error creating notification:", error)
  }
}

module.exports = {
  logActivity,
  createNotification
}
