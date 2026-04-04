const express = require("express")
const router = express.Router()
const { protect } = require("../middleware/userMiddleware")
const Notification = require("../model/notificationModel")

// @route   GET /api/notifications
// @desc    Get all notifications for logged in user
// @access  Private
router.get("/", protect, async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50) // Limit to 50 recent notifications
    res.json(notifications)
  } catch (error) {
    console.error("Error fetching notifications", error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   PUT /api/notifications/:id/read
// @desc    Mark a single notification as read
// @access  Private
router.put("/:id/read", protect, async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id)
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" })
    }
    
    // Ensure the notification belongs to the user
    if (notification.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" })
    }

    notification.read = true
    await notification.save()

    res.json(notification)
  } catch (error) {
    console.error("Error marking notification as read", error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   PUT /api/notifications/read-all
// @desc    Mark all unread notifications as read for logged in user
// @access  Private
router.put("/read-all", protect, async (req, res) => {
  try {
    await Notification.updateMany(
      { user: req.user._id, read: false },
      { $set: { read: true } }
    )
    res.json({ message: "All notifications marked as read" })
  } catch (error) {
    console.error("Error marking all notifications as read", error)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router
